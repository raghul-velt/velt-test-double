import type { Metadata } from 'next';
import { COPY } from '@/content/copy';
import { CROSS_DOC_DECOYS, PAGE_MARKERS, PLANTED_VIOLATIONS } from '@/content/violations';
import { getSiteMode, getSuperflowEnvStatus } from '@/lib/site-mode';
import content from '../components/content.module.css';
import { PageMarkerLine, SiteFooter, SiteHeader, chrome } from '../components/site-chrome';

export const metadata: Metadata = {
  title: 'Test harness',
  robots: { index: false, follow: false },
};

/**
 * The machine readable copy of everything this page shows in a table.
 *
 * scripts/verify-site.mjs reads this blob rather than carrying its own copy of the
 * marker and violation strings, so the verifier can never drift from the register in
 * content/violations.ts. It lives in a script tag, so it is not part of the rendered
 * DOM text an agent reads.
 */
function manifestJson(mode: string): string {
  const manifest = {
    mode,
    pages: PAGE_MARKERS,
    violations: PLANTED_VIOLATIONS,
    decoys: CROSS_DOC_DECOYS,
  };
  return JSON.stringify(manifest).replace(/</g, '\\u003c');
}

export default function HarnessPage() {
  const mode = getSiteMode();
  const copy = COPY[mode];
  const env = getSuperflowEnvStatus();

  return (
    <div className={chrome.page}>
      <SiteHeader links={copy.nav.links} cta={copy.nav.cta} ctaHref={copy.nav.ctaHref} />

      <main id="main" className={`${chrome.shell} ${chrome.main}`}>
        <div className={content.pageHead}>
          <h1>Test harness</h1>
          <p className={content.pageLede}>
            This page is the control panel for the Meridian Outfitters test property. It
            reports which copy the site is currently serving, lists the marker sentence on
            every page, and registers both the planted brand violations and the cross
            document decoys. It is not part of the store and is excluded from indexing.
          </p>
        </div>

        <section className={content.block} aria-labelledby="mode-title">
          <h2 id="mode-title">Current mode</h2>
          {/* One text node, so a verifier can read the mode out of the page text. */}
          <p className={content.modeBadge}>{`SITE-MODE=${mode}`}</p>
          <p className={content.pageLede}>
            {mode === 'buggy'
              ? 'The store is serving the copy with the planted violations. Every row in the planted violations table below should be present on the page named in it.'
              : 'The store is serving the brand compliant copy. No row in the planted violations table below should be present on the page named in it.'}
          </p>
          <div className={content.harnessNote}>
            <p>
              The mode comes from the SITE_MODE environment variable, read on the server.
              Unset means buggy. Because every page is statically generated, a mode change
              takes effect on the next deployment, not on the next request. The switch is
              one command and needs no commit:
            </p>
            <pre className={content.codeBlock}>{'./scripts/set-mode.sh clean\n./scripts/set-mode.sh buggy'}</pre>
            <p>
              That script removes and re-adds the production SITE_MODE variable with the
              Vercel CLI and then redeploys. Locally, run the build with the variable in
              front of it: <code>SITE_MODE=clean npm run build</code>.
            </p>
          </div>
        </section>

        <section className={content.block} aria-labelledby="markers-title">
          <h2 id="markers-title">Page markers</h2>
          <div className={content.tableWrap}>
            <table className={content.table}>
              <caption>
                Every page renders its marker as small text just above the footer.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Page</th>
                  <th scope="col">Path</th>
                  <th scope="col">Marker</th>
                </tr>
              </thead>
              <tbody>
                {PAGE_MARKERS.map((row) => (
                  <tr key={row.marker}>
                    <td>{row.label}</td>
                    <td>{row.page}</td>
                    <td>{row.marker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={content.block} aria-labelledby="violations-title">
          <h2 id="violations-title">Planted violations</h2>
          <p className={content.pageLede}>
            Seventeen violations of the Meridian Outfitters brand document, present in
            buggy mode only. An agent run with the Meridian document in effect is expected
            to report these.
          </p>
          <div className={content.tableWrap}>
            <table className={content.table}>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Meridian rule</th>
                  <th scope="col">Page</th>
                  <th scope="col">Description</th>
                  <th scope="col">Expect finding</th>
                </tr>
              </thead>
              <tbody>
                {PLANTED_VIOLATIONS.map((violation) => (
                  <tr key={violation.id}>
                    <td>{violation.id}</td>
                    <td>
                      {violation.alsoRule === undefined
                        ? String(violation.rule)
                        : `${violation.rule} and ${violation.alsoRule}`}
                    </td>
                    <td>{violation.page}</td>
                    <td>{violation.description}</td>
                    <td>{violation.expectFinding ? 'yes' : 'no'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={content.block} aria-labelledby="decoys-title">
          <h2 id="decoys-title">Cross document decoys</h2>
          <p className={content.pageLede}>
            These are present in both modes. Each one breaks a rule in the TechNova
            Solutions guidelines that govern the other test property, and none of them
            breaks anything in the Meridian document. A run that reports one of these read
            the wrong brand document.
          </p>
          <div className={content.tableWrap}>
            <table className={content.table}>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">TechNova rule</th>
                  <th scope="col">Page</th>
                  <th scope="col">Description</th>
                  <th scope="col">Expect finding</th>
                </tr>
              </thead>
              <tbody>
                {CROSS_DOC_DECOYS.map((decoy) => (
                  <tr key={decoy.id}>
                    <td>{decoy.id}</td>
                    <td>{decoy.technovaRule}</td>
                    <td>{decoy.page}</td>
                    <td>{decoy.description}</td>
                    <td>{`no, ${decoy.note}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={content.blockLast} aria-labelledby="env-title">
          <h2 id="env-title">Superflow toolbar environment</h2>
          <p className={content.pageLede}>
            Presence only. This page never prints the value of either variable, and
            neither does any other page.
          </p>
          <div className={content.envList}>
            <p className={content.envRow}>
              <span className={content.envName}>NEXT_PUBLIC_SUPERFLOW_API_KEY</span>
              <span>{env.apiKeyPresent ? 'present' : 'missing'}</span>
            </p>
            <p className={content.envRow}>
              <span className={content.envName}>NEXT_PUBLIC_SUPERFLOW_PROJECT_ID</span>
              <span>{env.projectIdPresent ? 'present' : 'missing'}</span>
            </p>
            <p className={content.envRow}>
              <span className={content.envName}>Toolbar script tag rendered</span>
              <span>{env.ready ? 'yes' : 'no, at least one variable is missing'}</span>
            </p>
          </div>
        </section>

        <PageMarkerLine marker={copy.harness.marker} />
      </main>

      <script
        id="harness-manifest"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: manifestJson(mode) }}
      />

      <SiteFooter copy={copy.footer.default} />
    </div>
  );
}
