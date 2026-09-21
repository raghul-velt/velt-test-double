/**
 * The register of what is wrong with the buggy build, and of what is deliberately
 * wrong in both builds but should not be reported.
 *
 * Two lists live here.
 *
 * PLANTED_VIOLATIONS describes each rule in the Meridian Outfitters brand document
 * that the buggy build breaks. A Workspace Agent run against the buggy site with the
 * Meridian document in effect should find these, and a run against the clean site
 * should find none of them.
 *
 * CROSS_DOC_DECOYS describes copy that is present in BOTH builds and that breaks the
 * TechNova Solutions guidelines used by the other test property. The Meridian document
 * says nothing about any of it. A run that reports a decoy read the wrong brand
 * document, which is the whole point of having two properties.
 *
 * scripts/verify-site.mjs drives itself from the machine readable copy of this file
 * that /harness embeds, so the strings below are the single source of truth for both
 * the harness page and the verifier.
 */

export interface PlantedViolation {
  /** Stable identifier, also used in the verifier output. */
  id: string;
  /** The numbered rule in the Meridian Outfitters brand document that this breaks. */
  rule: number;
  /** Second rule, where one piece of copy breaks two at once. */
  alsoRule?: number;
  /** Path the violation appears on. */
  page: string;
  description: string;
  /** Always true here. The decoys are the list where this is false. */
  expectFinding: boolean;
  /**
   * How the verifier proves the violation is present in buggy mode and absent in
   * clean mode. A `buggyText` must be present in buggy and absent in clean. A
   * `buggyPattern` is the same thing as a regular expression, for the cases where
   * the buggy string is a prefix of the clean one. A `countText` counts occurrences,
   * which is how the omissions are checked, since an omission has no string of its own.
   */
  check: {
    buggyText?: string;
    buggyPattern?: string;
    cleanText?: string;
    countText?: string;
    cleanCount?: number;
    buggyCount?: number;
  };
}

export interface CrossDocDecoy {
  id: string;
  /** The numbered rule in the TechNova Solutions guidelines that this would break. */
  technovaRule: number;
  page: string;
  description: string;
  /** The note that explains why a finding here is a failure, not a success. */
  note: string;
  expectFinding: boolean;
  /** Present in both modes, so the verifier asserts presence regardless of mode. */
  presentText: string;
}

export const PLANTED_VIOLATIONS: PlantedViolation[] = [
  {
    id: 'V01',
    rule: 4,
    page: '/',
    description:
      'Hero eyebrow uses an urgency phrase. Clean copy reads "New for the autumn season".',
    expectFinding: true,
    check: {
      buggyText: 'Hurry, only a few left in every size',
      cleanText: 'New for the autumn season',
    },
  },
  {
    id: 'V02',
    rule: 2,
    alsoRule: 5,
    page: '/',
    description:
      'Promo line calls the price cheap and spells colors the British way. Clean copy reads "Fair prices on last season\'s colors".',
    expectFinding: true,
    check: {
      buggyText: "Cheap prices on last season's colours",
      cleanText: "Fair prices on last season's colors",
    },
  },
  {
    id: 'V03',
    rule: 6,
    alsoRule: 7,
    page: '/',
    description:
      'First featured card shows a bare dollar sign price that ends in .99. Clean copy reads "USD 148.00".',
    expectFinding: true,
    check: {
      buggyText: '$149.99',
      cleanText: 'USD 148.00',
    },
  },
  {
    id: 'V04',
    rule: 11,
    alsoRule: 3,
    page: '/',
    description:
      'Second featured card labels its purchase button "Buy now!", which is both a banned label and an exclamation mark. Clean copy reads "Add to bag".',
    expectFinding: true,
    check: {
      buggyText: 'Buy now!',
      cleanText: 'Add to bag',
    },
  },
  {
    id: 'V05',
    rule: 8,
    page: '/',
    description:
      'Third featured card omits the returns sentence. Clean copy shows "Free returns within 60 days" on all three cards.',
    expectFinding: true,
    check: {
      countText: 'Free returns within 60 days',
      cleanCount: 3,
      buggyCount: 2,
    },
  },
  {
    id: 'V06',
    rule: 9,
    page: '/shop',
    description:
      'Boots card writes the product name in lowercase. Clean copy reads "Traverse Hiking Boots".',
    expectFinding: true,
    check: {
      buggyText: 'traverse hiking boots',
      cleanText: 'Traverse Hiking Boots',
    },
  },
  {
    id: 'V07',
    rule: 10,
    page: '/shop',
    description:
      'Parka card lists apparel sizes out of order. Clean copy reads "XS, S, M, L, XL".',
    expectFinding: true,
    check: {
      buggyText: 'M, S, L, XS, XL',
      cleanText: 'XS, S, M, L, XL',
    },
  },
  {
    id: 'V08',
    rule: 11,
    page: '/shop',
    description:
      'Rain shell card labels its purchase button "Add to cart". Clean copy reads "Add to bag".',
    expectFinding: true,
    check: {
      buggyText: 'Add to cart',
      cleanText: 'Add to bag',
    },
  },
  {
    id: 'V09',
    rule: 12,
    page: '/products/ridgeline-down-parka',
    description:
      'Parka page omits the fabric composition line. Clean copy reads "100 percent recycled nylon shell, 700 fill responsibly sourced down".',
    expectFinding: true,
    check: {
      countText: '100 percent recycled nylon shell, 700 fill responsibly sourced down',
      cleanCount: 1,
      buggyCount: 0,
    },
  },
  {
    id: 'V10',
    rule: 6,
    page: '/products/basecamp-two-person-tent',
    description:
      'Tent page shows a price with no decimals. Clean copy reads "USD 389.00".',
    expectFinding: true,
    check: {
      buggyPattern: 'USD 389(?!\\.)',
      cleanText: 'USD 389.00',
    },
  },
  {
    id: 'V11',
    rule: 21,
    page: '/journal',
    description:
      'Third journal entry is published with no author. Clean copy reads "By Elena Marsh".',
    expectFinding: true,
    check: {
      countText: 'By Elena Marsh',
      cleanCount: 1,
      buggyCount: 0,
    },
  },
  {
    id: 'V12',
    rule: 22,
    page: '/contact',
    description:
      'Contact details abbreviate the street and drop the ZIP code. Clean copy reads "88 Harbor Street, Portland, ME 04101".',
    expectFinding: true,
    check: {
      buggyText: '88 Harbor St., Portland Maine',
      cleanText: '88 Harbor Street, Portland, ME 04101',
    },
  },
  {
    id: 'V13',
    rule: 23,
    page: '/contact',
    description:
      'Contact hours hyphenate both the days and the times. Clean copy reads "Mon to Sat, 9:00 AM to 6:00 PM ET".',
    expectFinding: true,
    check: {
      buggyText: 'Mon-Sat 9-6',
      cleanText: 'Mon to Sat, 9:00 AM to 6:00 PM ET',
    },
  },
  {
    id: 'V14',
    rule: 25,
    page: '/contact',
    description:
      'Contact form button is labelled "Submit". Clean copy reads "Send message".',
    expectFinding: true,
    check: {
      buggyText: 'Submit',
      cleanText: 'Send message',
    },
  },
  {
    id: 'V15',
    rule: 1,
    page: '/about',
    description:
      'Footer wordmark is lowercased on the About page only. Clean copy reads "Meridian Outfitters".',
    expectFinding: true,
    check: {
      buggyText: 'meridian outfitters',
      cleanText: 'Meridian Outfitters',
    },
  },
  {
    id: 'V16',
    rule: 20,
    page: '/journal',
    description:
      'Footer omits the sustainability statement on the Journal page only. Clean copy shows "Made to be repaired, not replaced" on every page.',
    expectFinding: true,
    check: {
      countText: 'Made to be repaired, not replaced',
      cleanCount: 1,
      buggyCount: 0,
    },
  },
  {
    id: 'V17',
    rule: 3,
    page: '/',
    description:
      'The "Why Meridian" heading ends in an exclamation mark. Clean copy reads "Built for the long way round".',
    expectFinding: true,
    check: {
      buggyText: 'Built for the long way round!',
      cleanText: 'Built for the long way round',
    },
  },
];

export const CROSS_DOC_DECOYS: CrossDocDecoy[] = [
  {
    id: 'D01',
    technovaRule: 16,
    page: '/',
    description:
      'The "Why Meridian" row uses three emoji as its icons. TechNova rule 16 forbids emoji icons. The Meridian document says nothing about emoji.',
    note: 'expected NOT to be flagged when the Meridian document is in effect',
    expectFinding: false,
    presentText: '\u{1F9ED}',
  },
  {
    id: 'D02',
    technovaRule: 9,
    page: '/journal',
    description:
      'Two journal cards use the bare link label "Learn More". TechNova rule 9 requires descriptive link text. The Meridian document says nothing about link labels.',
    note: 'expected NOT to be flagged when the Meridian document is in effect',
    expectFinding: false,
    presentText: 'Learn More',
  },
  {
    id: 'D03',
    technovaRule: 22,
    page: '/about',
    description:
      'The About page writes "our CICD pipeline for the web store" without slashes. TechNova rule 22 requires "CI/CD". The Meridian document says nothing about technical abbreviations.',
    note: 'expected NOT to be flagged when the Meridian document is in effect',
    expectFinding: false,
    presentText: 'our CICD pipeline for the web store',
  },
];

/** Every page on the site, with the marker sentence it renders near its footer. */
export interface PageMarker {
  page: string;
  marker: string;
  label: string;
}

export const PAGE_MARKERS: PageMarker[] = [
  { page: '/', marker: 'MERIDIAN-HOME-MARKER-1101', label: 'Home' },
  { page: '/shop', marker: 'MERIDIAN-SHOP-MARKER-1201', label: 'Shop' },
  {
    page: '/products/ridgeline-down-parka',
    marker: 'MERIDIAN-PRODUCT-MARKER-1301',
    label: 'Product: Ridgeline Down Parka',
  },
  {
    page: '/products/basecamp-two-person-tent',
    marker: 'MERIDIAN-PRODUCT-MARKER-1302',
    label: 'Product: Basecamp Two Person Tent',
  },
  {
    page: '/products/traverse-hiking-boots',
    marker: 'MERIDIAN-PRODUCT-MARKER-1303',
    label: 'Product: Traverse Hiking Boots',
  },
  { page: '/journal', marker: 'MERIDIAN-JOURNAL-MARKER-1401', label: 'Journal' },
  { page: '/about', marker: 'MERIDIAN-ABOUT-MARKER-1501', label: 'About' },
  { page: '/contact', marker: 'MERIDIAN-CONTACT-MARKER-1601', label: 'Contact' },
  { page: '/harness', marker: 'MERIDIAN-HARNESS-MARKER-1901', label: 'Harness' },
];
