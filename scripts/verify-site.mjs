#!/usr/bin/env node
/**
 * Verify a running Meridian Outfitters deployment.
 *
 *   node scripts/verify-site.mjs http://localhost:3123
 *   node scripts/verify-site.mjs https://velt-test-double.vercel.app
 *
 * What it does, in order:
 *
 *   1. Fetches /harness and reads the mode out of the page text, then reads the
 *      machine readable register the harness embeds. The verifier carries no copy of
 *      the marker or violation strings of its own, so it cannot drift from
 *      content/violations.ts.
 *   2. Fetches every page and asserts its marker sentence is present.
 *   3. For the mode it detected, asserts every planted violation. In buggy mode each
 *      violation string must be present on its page. In clean mode each must be
 *      absent and the corrected string must be present. Omissions, which have no
 *      string of their own, are checked by counting occurrences instead.
 *   4. Asserts every cross document decoy is present, in both modes. The decoys are
 *      supposed to be there. They exist so a review that flags one can be recognised
 *      as having used the wrong brand document.
 *
 * Exits non-zero if any assertion fails. Node 22 and its built in fetch, no
 * dependencies.
 */

const baseUrlArg = process.argv[2];

if (!baseUrlArg) {
  console.error('Usage: node scripts/verify-site.mjs <baseUrl>');
  console.error('Example: node scripts/verify-site.mjs http://localhost:3123');
  process.exit(2);
}

const BASE_URL = baseUrlArg.replace(/\/+$/, '');

/* --------------------------------------------------------------- helpers -- */

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&nbsp;': ' ',
};

function decodeEntities(value) {
  return value
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, (match) => ENTITIES[match])
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function collapse(value) {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Two views of a page.
 *
 * `raw` keeps the tags, so an assertion also matches text that lives in an attribute,
 * such as the alt text on a product placeholder. `text` is the tags stripped out, which
 * is what an agent reading the rendered DOM sees, and is what occurrence counts use.
 * Script and style blocks are removed from both, so the framework's own serialized
 * payload never counts as page copy.
 */
function viewsOf(html) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  return {
    raw: collapse(decodeEntities(withoutScripts)),
    text: collapse(decodeEntities(withoutScripts.replace(/<[^>]+>/g, ' '))),
  };
}

function countOccurrences(haystack, needle) {
  if (needle.length === 0) {
    return 0;
  }
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

const pageCache = new Map();

async function loadPage(path) {
  if (pageCache.has(path)) {
    return pageCache.get(path);
  }
  const url = `${BASE_URL}${path}`;
  let response;
  try {
    response = await fetch(url, { redirect: 'follow' });
  } catch (error) {
    throw new Error(`could not fetch ${url}: ${error.message}`);
  }
  if (!response.ok) {
    throw new Error(`${url} answered HTTP ${response.status}`);
  }
  const views = viewsOf(await response.text());
  pageCache.set(path, views);
  return views;
}

const results = [];

function record(ok, label, detail) {
  results.push({ ok, label, detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`  ${mark}  ${label}${detail ? ` : ${detail}` : ''}`);
}

function present(views, needle) {
  return views.raw.includes(needle) || views.text.includes(needle);
}

/* ------------------------------------------------------------------ run -- */

async function main() {
  console.log(`Meridian Outfitters site verification`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log('');

  // 1. Harness: mode and register.
  const harness = await loadPage('/harness');

  const modeMatch = harness.text.match(/SITE-MODE=(clean|buggy)/);
  if (!modeMatch) {
    console.error('FATAL: could not read SITE-MODE from the /harness page text.');
    process.exit(1);
  }
  const mode = modeMatch[1];

  const harnessHtml = await fetch(`${BASE_URL}/harness`).then((r) => r.text());
  const manifestMatch = harnessHtml.match(
    /<script[^>]*id="harness-manifest"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!manifestMatch) {
    console.error('FATAL: could not find the harness manifest on /harness.');
    process.exit(1);
  }
  const manifest = JSON.parse(manifestMatch[1].replace(/\\u003c/g, '<'));

  console.log(`Detected mode: ${mode}`);
  console.log(
    `Register: ${manifest.pages.length} pages, ${manifest.violations.length} planted violations, ${manifest.decoys.length} cross document decoys`,
  );
  console.log('');

  if (manifest.mode !== mode) {
    record(false, 'harness mode agrees with the embedded register', `${mode} vs ${manifest.mode}`);
  } else {
    record(true, 'harness mode agrees with the embedded register', mode);
  }

  // 2. Markers.
  console.log('');
  console.log('Page markers');
  for (const page of manifest.pages) {
    const views = await loadPage(page.page);
    record(
      present(views, page.marker),
      `${page.page} renders ${page.marker}`,
      present(views, page.marker) ? '' : 'marker not found in page text',
    );
  }

  // 3. Planted violations.
  console.log('');
  console.log(`Planted violations, expected ${mode === 'buggy' ? 'PRESENT' : 'ABSENT'}`);
  for (const violation of manifest.violations) {
    const views = await loadPage(violation.page);
    const check = violation.check;
    const rule =
      violation.alsoRule === undefined
        ? `rule ${violation.rule}`
        : `rules ${violation.rule} and ${violation.alsoRule}`;
    const label = `${violation.id} ${violation.page} (${rule})`;

    if (typeof check.countText === 'string') {
      const expected = mode === 'buggy' ? check.buggyCount : check.cleanCount;
      const actual = countOccurrences(views.text, check.countText);
      record(
        actual === expected,
        label,
        `"${check.countText}" x${actual}, expected x${expected}`,
      );
      continue;
    }

    if (typeof check.buggyPattern === 'string') {
      const pattern = new RegExp(check.buggyPattern);
      const hit = pattern.test(views.raw) || pattern.test(views.text);
      if (mode === 'buggy') {
        record(hit, label, hit ? `matched /${check.buggyPattern}/` : `no match for /${check.buggyPattern}/`);
      } else {
        const cleanOk = check.cleanText ? present(views, check.cleanText) : true;
        record(
          !hit && cleanOk,
          label,
          !hit
            ? cleanOk
              ? `corrected form "${check.cleanText}" present`
              : `corrected form "${check.cleanText}" MISSING`
            : `buggy pattern /${check.buggyPattern}/ still matches`,
        );
      }
      continue;
    }

    if (typeof check.buggyText === 'string') {
      const hit = present(views, check.buggyText);
      if (mode === 'buggy') {
        record(hit, label, hit ? `"${check.buggyText}" present` : `"${check.buggyText}" NOT FOUND`);
      } else {
        const cleanOk = check.cleanText ? present(views, check.cleanText) : true;
        record(
          !hit && cleanOk,
          label,
          hit
            ? `"${check.buggyText}" is still on the page`
            : cleanOk
              ? `corrected form "${check.cleanText}" present`
              : `corrected form "${check.cleanText}" MISSING`,
        );
      }
      continue;
    }

    record(false, label, 'the register gives this violation no check to run');
  }

  // 4. Decoys, present in both modes.
  console.log('');
  console.log('Cross document decoys, expected PRESENT in both modes and NOT flagged by a review');
  for (const decoy of manifest.decoys) {
    const views = await loadPage(decoy.page);
    const hit = present(views, decoy.presentText);
    record(
      hit,
      `${decoy.id} ${decoy.page} (TechNova rule ${decoy.technovaRule})`,
      hit ? `"${decoy.presentText}" present` : `"${decoy.presentText}" NOT FOUND`,
    );
  }

  // Summary.
  const failed = results.filter((entry) => !entry.ok);
  console.log('');
  console.log('-'.repeat(72));
  console.log(
    `Mode: ${mode}. ${results.length - failed.length} passed, ${failed.length} failed, ${results.length} checks total.`,
  );

  if (failed.length > 0) {
    console.log('');
    console.log('Failures:');
    for (const entry of failed) {
      console.log(`  - ${entry.label}${entry.detail ? ` : ${entry.detail}` : ''}`);
    }
    process.exit(1);
  }

  console.log('All checks passed.');
}

main().catch((error) => {
  console.error('');
  console.error(`FATAL: ${error.message}`);
  process.exit(1);
});
