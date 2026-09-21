# Meridian Outfitters

The second test property for Superflow's Workspace Agent.

It is a small Next.js 16 store for a fictional outdoor gear brand, built for one
purpose: to find out whether a brand guideline review used the right brand document.
The agent reads the rendered DOM text of each page and reports guideline violations,
so everything this site tests is present as visible text or as an attribute, never
only in CSS.

The binding brand document is `guidelines/meridian-brand-guidelines.html`, twenty five
numbered rules covering voice, prices, product copy, color and type, imagery, the
journal, and contact details. The PDF of the same document sits beside it.

The site serves one of two versions of its copy:

- **clean** satisfies every rule in the Meridian document that can be checked from
  rendered DOM text.
- **buggy** is the same site with seventeen named violations planted in it, and
  nothing else changed.

Both versions also carry three **cross document decoys**: copy that breaks the
TechNova Solutions guidelines governing the sibling property at
`velt-agent-test-site`, and that the Meridian document says nothing about. A review
that reports a decoy read the wrong document. That is the single question this
property exists to answer.

## The two modes, and how to flip them

The mode comes from the `SITE_MODE` environment variable, read on the server through
`lib/site-mode.ts`. It is deliberately not a `NEXT_PUBLIC_` variable, so the value
never reaches the browser bundle.

| `SITE_MODE` | Site serves |
| --- | --- |
| `clean` | brand compliant copy, no planted violations |
| `buggy` | the seventeen planted violations |
| unset | `buggy` |

Every page is a server component and every page is statically generated, so the value
is read at build time. **A mode change takes effect on the next deployment, not on the
next request.** No commit is needed, because nothing in `app/` differs between the two
modes: the difference lives entirely in `content/copy.ts`.

Flipping production is one command:

```bash
./scripts/set-mode.sh clean
./scripts/set-mode.sh buggy
```

The script removes the production `SITE_MODE` variable, re-adds it with the new value,
and redeploys, all through the Vercel CLI against the `velt-team-eng` scope:

```bash
npx vercel env rm SITE_MODE production --scope velt-team-eng --yes
printf '%s' clean | npx vercel env add SITE_MODE production --scope velt-team-eng
npx vercel --prod --yes --scope velt-team-eng
```

Locally, put the variable in front of the build:

```bash
npm run build             # buggy, because SITE_MODE is unset
SITE_MODE=clean npm run build
npx next start -p 3123
```

## Pages and markers

Every page renders a unique marker sentence as small text just above the footer, in
the form `Reference: MERIDIAN-HOME-MARKER-1101`. A finding that quotes a marker can be
traced to the exact page it came from, which matters because several pages carry very
similar copy.

| Page | Path | Marker |
| --- | --- | --- |
| Home | `/` | `MERIDIAN-HOME-MARKER-1101` |
| Shop | `/shop` | `MERIDIAN-SHOP-MARKER-1201` |
| Ridgeline Down Parka | `/products/ridgeline-down-parka` | `MERIDIAN-PRODUCT-MARKER-1301` |
| Basecamp Two Person Tent | `/products/basecamp-two-person-tent` | `MERIDIAN-PRODUCT-MARKER-1302` |
| Traverse Hiking Boots | `/products/traverse-hiking-boots` | `MERIDIAN-PRODUCT-MARKER-1303` |
| Journal | `/journal` | `MERIDIAN-JOURNAL-MARKER-1401` |
| About | `/about` | `MERIDIAN-ABOUT-MARKER-1501` |
| Contact | `/contact` | `MERIDIAN-CONTACT-MARKER-1601` |
| Harness | `/harness` | `MERIDIAN-HARNESS-MARKER-1901` |

The three product pages are prerendered from `generateStaticParams` and
`dynamicParams = false`, so those three slugs exist and nothing else under
`/products/` does. The other three products in the catalogue are shop cards only, and
their cards point back at `/shop`.

`/harness` is the control panel: it reports the current mode, lists the markers, and
renders both registers below as tables, plus the Superflow environment status. It is
marked `noindex`.

## Planted violations, buggy mode only

Seventeen violations, each breaking a numbered rule in the Meridian document. The
register lives in `content/violations.ts` as `PLANTED_VIOLATIONS`.

| ID | Rule | Page | Buggy copy | Clean copy |
| --- | --- | --- | --- | --- |
| V01 | 4 | `/` | `Hurry, only a few left in every size` | `New for the autumn season` |
| V02 | 2, 5 | `/` | `Cheap prices on last season's colours` | `Fair prices on last season's colors` |
| V03 | 6, 7 | `/` | `$149.99` | `USD 148.00` |
| V04 | 11, 3 | `/` | `Buy now!` | `Add to bag` |
| V05 | 8 | `/` | returns sentence absent from the third featured card, so `Free returns within 60 days` appears twice | present on all three cards, so it appears three times |
| V06 | 9 | `/shop` | `traverse hiking boots` | `Traverse Hiking Boots` |
| V07 | 10 | `/shop` | `M, S, L, XS, XL` | `XS, S, M, L, XL` |
| V08 | 11 | `/shop` | `Add to cart` | `Add to bag` |
| V09 | 12 | `/products/ridgeline-down-parka` | composition line absent | `100 percent recycled nylon shell, 700 fill responsibly sourced down` |
| V10 | 6 | `/products/basecamp-two-person-tent` | `USD 389` | `USD 389.00` |
| V11 | 21 | `/journal` | third entry has no byline | `By Elena Marsh` |
| V12 | 22 | `/contact` | `88 Harbor St., Portland Maine` | `88 Harbor Street, Portland, ME 04101` |
| V13 | 23 | `/contact` | `Mon-Sat 9-6` | `Mon to Sat, 9:00 AM to 6:00 PM ET` |
| V14 | 25 | `/contact` | `Submit` | `Send message` |
| V15 | 1 | `/about` | footer wordmark reads `meridian outfitters` | `Meridian Outfitters` |
| V16 | 20 | `/journal` | footer omits the sustainability statement | `Made to be repaired, not replaced` |
| V17 | 3 | `/` | `Built for the long way round!` | `Built for the long way round` |

Two notes on scoping.

V12 and V13 are planted in the **contact page body only**. The shared footer keeps the
canonical address and hours on every page, including `/contact`, so each violation
stays on the one page the register names it on. In buggy mode the contact page is
therefore internally inconsistent, which is the intended shape.

V15 and V16 are the two footer violations, and each is applied to exactly one page's
footer. `content/copy.ts` exposes three footer objects, `default`, `about` and
`journal`, and every page picks one.

## Cross document decoys, present in both modes

These break the TechNova Solutions guidelines that govern the sibling property. The
Meridian document is silent on all three. Each is **expected NOT to be flagged when
the Meridian document is in effect**. A run that reports one of them used the wrong
brand document. They live in `content/violations.ts` as `CROSS_DOC_DECOYS`.

| ID | TechNova rule | Page | What it is |
| --- | --- | --- | --- |
| D01 | 16 | `/` | the "Why Meridian" row uses three emoji as its icons |
| D02 | 9 | `/journal` | two journal cards use the bare link label `Learn More` |
| D03 | 22 | `/about` | the page writes `our CICD pipeline for the web store` without slashes |

The footer copyright year, 2026, is correct for both documents and is not a decoy.

## Superflow toolbar

`app/layout.tsx` renders a `next/script` tag with `id="superflowToolbarScript"`,
`data-sf-platform="other-manual"`, `async`, and a `src` built from the two environment
variables:

```
https://cdn.jsdelivr.net/npm/@usesuperflow/toolbar-staging/superflow.min.js?apiKey=...&projectId=...
```

If either variable is missing, **no script tag is rendered at all**, because a toolbar
URL with an empty key looks installed and is not. `/harness` reports which one is
absent. Neither value is hardcoded anywhere in the repository, and `/harness` prints
presence only, never a value.

| Variable | Purpose |
| --- | --- |
| `SITE_MODE` | `clean` or `buggy`. Server side only. Unset means buggy. |
| `NEXT_PUBLIC_SUPERFLOW_API_KEY` | Superflow project API key for the toolbar embed |
| `NEXT_PUBLIC_SUPERFLOW_PROJECT_ID` | Superflow project id for the toolbar embed |

`.env.example` documents all three. Copy it to `.env.local` for local development.

## Verifying a deployment

```bash
node scripts/verify-site.mjs http://localhost:3123
node scripts/verify-site.mjs https://<your-deployment>.vercel.app
```

The verifier reads the mode out of the `/harness` page text, then reads the machine
readable register that `/harness` embeds, so it carries no copy of the marker or
violation strings of its own and cannot drift from `content/violations.ts`. It then:

1. fetches every page and asserts its marker is present,
2. asserts every planted violation, present in buggy mode and absent in clean mode,
   with the corrected string present instead. The four omissions are checked by
   counting occurrences, since an omission has no string of its own,
3. asserts every cross document decoy is present, in both modes.

It exits non-zero on any failure and needs nothing beyond Node 22 and its built in
`fetch`. `.github/workflows/verify.yml` runs it on `workflow_dispatch` with a
`base_url` input.

## Working on the site

```bash
npm run dev                          # dev server on :3000
npm run build                        # buggy build
SITE_MODE=clean npm run build        # clean build
npx next start -p 3123               # serve the last build
npx tsc --noEmit                     # typecheck
```

Layout of what matters:

```
app/
  layout.tsx                 fonts, metadata, the Superflow toolbar embed
  globals.css                brand tokens: bone, ink, forest, moss, clay, 2px radius
  page.tsx, page.module.css  home
  components/                header, footer, product card, placeholder art, marker
  shop/ journal/ about/ contact/ harness/
  products/[slug]/           three prerendered product pages
content/
  copy.ts                    COPY, PRODUCTS, JOURNAL, CONTACT, each keyed clean/buggy
  violations.ts              PLANTED_VIOLATIONS, CROSS_DOC_DECOYS, PAGE_MARKERS
lib/site-mode.ts             getSiteMode, isBuggy, Superflow env presence
scripts/set-mode.sh          flip production mode through the Vercel CLI
scripts/verify-site.mjs      the verifier
guidelines/                  the binding Meridian brand document, HTML and PDF
```

The rule the components follow: **no component asks which mode it is in.** A page
reads the selected copy object once and hands the pieces down. There is no
`if (buggy)` in any JSX. The buggy copy is built by spreading the clean copy and
applying named overrides, so the two can never drift out of shape and an unplanted
difference cannot creep in by accident.

Brand constraints worth knowing before editing copy: no exclamation marks, no urgency
phrases, no British spellings, every price as a currency code with two decimals and
never ending in `.99`, product names in Title Case, apparel sizes always
`XS, S, M, L, XL`, purchase buttons always labelled `Add to bag`, and
`Free returns within 60 days` on every product card and product page. The clean build
is checked against all of these.

There are no em dashes in the site copy or in this document.

## How this differs from velt-agent-test-site

The sibling property, TechNova Solutions, is a developer tooling site: purple accent,
Geist fonts, its own guidelines document. This one is deliberately a different brand
and, more importantly, a different testing architecture, so a reviewer can tell at a
glance which document a run actually used.

| | `velt-agent-test-site` (TechNova) | this repo (Meridian) |
| --- | --- | --- |
| Mode switch | a GitHub Actions workflow copies `variants/home.<mode>.tsx` over `app/page.tsx` and commits | one environment variable, `SITE_MODE`, read at build time |
| What a flip costs | a commit, a push and a deploy | `./scripts/set-mode.sh <mode>`, no commit |
| Where the two versions live | two complete duplicated page files under `variants/` | one set of pages, two copy tables in `content/copy.ts` |
| Scope of the switch | the home page only | every page at once |
| Register of what is planted | in the variant files and the workflow | typed and exported from `content/violations.ts` |
| Introspection | none | `/harness` renders the mode, markers, violations, decoys and env status |
| Checking a deployment | by eye | `scripts/verify-site.mjs`, exits non-zero on failure, driven by the harness register |
| Cross document decoys | none | three, present in both modes |
| Brand | purple, Geist, developer tooling | bone and forest green, Fraunces and Work Sans, outdoor gear |

The practical consequence of the runtime switch: because the pages are statically
generated, the flip is not free of a deploy, it is free of a **commit**. The git
history of this repo stays a history of the site, not a log of which mode it was in.
