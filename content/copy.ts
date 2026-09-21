/**
 * Every word on the Meridian Outfitters store that differs between the two site modes.
 *
 * The rule this file exists to enforce: components never ask which mode they are in.
 * A page reads the selected copy object once, hands the pieces to its components, and
 * the components render whatever they are given. There is no `if (buggy)` in any JSX.
 *
 * COPY.clean satisfies every rule in the Meridian brand document that can be checked
 * from rendered DOM text. COPY.buggy is COPY.clean with a small, named set of planted
 * violations applied on top. content/violations.ts is the register of what those are.
 */

import type { SiteMode } from '@/lib/site-mode';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterCopy {
  /** Rule 1. The About page footer in buggy mode lowercases this, nowhere else does. */
  wordmark: string;
  /** Rule 20. Null means the statement is omitted, which the Journal page does in buggy mode. */
  sustainability: string | null;
  address: string;
  hours: string;
  telLabel: string;
  telHref: string;
  copyright: string;
}

export interface WhyPoint {
  /** Emoji icon. A cross document decoy: TechNova rule 16 bans these, Meridian is silent. */
  icon: string;
  iconLabel: string;
  title: string;
  body: string;
}

export interface ProductCard {
  slug: string;
  /** Rule 9. Title Case, except the planted lowercase boots name on the shop page. */
  name: string;
  /** Rule 18. The color named in the alt text. */
  color: string;
  /** Rule 6 and rule 7. Currency code, two decimals, never ending .99 or .95. */
  price: string;
  /** Rule 10. Apparel only, always XS, S, M, L, XL. Null for gear. */
  sizes: string[] | null;
  /** Rule 8. Null means the sentence is missing, which is a planted violation. */
  returns: string | null;
  /** Rule 11. Always "Add to bag" in clean mode. */
  buttonLabel: string;
  /** Rule 18. Names the product and its color. Rule 17. Plain bone background. */
  alt: string;
  /** Hex used for the inline SVG placeholder shape, never for text or buttons. */
  tint: string;
  blurb: string;
}

export interface ProductDetail extends ProductCard {
  marker: string;
  /** Rule 12. Null means the composition line is missing, a planted violation. */
  material: string | null;
  description: string[];
}

export interface JournalEntry {
  title: string;
  /** Rule 21. Null means no author is shown, a planted violation on the third entry. */
  author: string | null;
  date: string;
  excerpt: string;
  /** "Learn More" on two entries is a cross document decoy for TechNova rule 9. */
  linkLabel: string;
  href: string;
}

export interface ContactDetails {
  /** Rule 22. */
  address: string;
  /** Rule 23. */
  hours: string;
  /** Rule 24. */
  telLabel: string;
  telHref: string;
  /** Rule 25. */
  submitLabel: string;
}

export interface SiteCopy {
  nav: {
    links: NavLink[];
    cta: string;
    ctaHref: string;
  };
  home: {
    eyebrow: string;
    title: string;
    lede: string;
    promo: string;
    whyTitle: string;
    whyPoints: WhyPoint[];
    featuredTitle: string;
    featuredLede: string;
    journalTitle: string;
    journalLede: string;
    marker: string;
  };
  shop: {
    title: string;
    lede: string;
    marker: string;
  };
  journal: {
    title: string;
    lede: string;
    marker: string;
  };
  about: {
    title: string;
    storyTitle: string;
    story: string[];
    sustainabilityTitle: string;
    sustainability: string[];
    marker: string;
  };
  contact: {
    title: string;
    lede: string;
    formTitle: string;
    marker: string;
  };
  harness: {
    marker: string;
  };
  /** One footer per page shape. Most pages take `default`. */
  footer: {
    default: FooterCopy;
    about: FooterCopy;
    journal: FooterCopy;
  };
}

/* -------------------------------------------------------------------------- */
/* Shared constants                                                            */
/* -------------------------------------------------------------------------- */

const RETURNS = 'Free returns within 60 days';
const SUSTAINABILITY = 'Made to be repaired, not replaced';
const WORDMARK = 'Meridian Outfitters';
const ADDRESS = '88 Harbor Street, Portland, ME 04101';
const HOURS = 'Mon to Sat, 9:00 AM to 6:00 PM ET';
const TEL_LABEL = '(207) 555-0188';
const TEL_HREF = 'tel:+12075550188';
const COPYRIGHT = '© 2026 Meridian Outfitters';
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const BASE_FOOTER: FooterCopy = {
  wordmark: WORDMARK,
  sustainability: SUSTAINABILITY,
  address: ADDRESS,
  hours: HOURS,
  telLabel: TEL_LABEL,
  telHref: TEL_HREF,
  copyright: COPYRIGHT,
};

const NAV_LINKS: NavLink[] = [
  { label: 'Shop', href: '/shop' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/* -------------------------------------------------------------------------- */
/* Copy: clean                                                                 */
/* -------------------------------------------------------------------------- */

const CLEAN_COPY: SiteCopy = {
  nav: {
    links: NAV_LINKS,
    cta: 'Shop the collection',
    ctaHref: '/shop',
  },
  home: {
    eyebrow: 'New for the autumn season',
    title: 'Gear that comes home with you',
    lede: 'Meridian Outfitters makes a small run of outdoor clothing and shelter, cut for long days and built so that a worn seam is a repair rather than a replacement. Every piece is stocked year round and every piece can be sent back to us for mending.',
    promo: "Fair prices on last season's colors",
    whyTitle: 'Built for the long way round',
    whyPoints: [
      {
        icon: '\u{1F9ED}',
        iconLabel: 'Compass',
        title: 'Made for real distance',
        body: 'Every garment is tested on the coast trail through a full winter before it reaches the store. Nothing ships on a sample alone.',
      },
      {
        icon: '\u{1F9F5}',
        iconLabel: 'Thread',
        title: 'Repaired, not replaced',
        body: 'Send any Meridian piece back and our workshop in Portland will mend it. Most repairs are done inside two weeks and cost nothing.',
      },
      {
        icon: '\u{1F332}',
        iconLabel: 'Evergreen tree',
        title: 'Materials we can account for',
        body: 'Down is responsibly sourced, shells are recycled nylon, and the wool comes from three farms we buy from directly.',
      },
    ],
    featuredTitle: 'Featured this season',
    featuredLede: 'Three pieces that carry most of the year for most people.',
    journalTitle: 'From the Journal',
    journalLede: 'Field notes, repair guides, and the occasional trip report.',
    marker: 'MERIDIAN-HOME-MARKER-1101',
  },
  shop: {
    title: 'Shop',
    lede: 'The full Meridian range. Six pieces, stocked year round, each of them repairable.',
    marker: 'MERIDIAN-SHOP-MARKER-1201',
  },
  journal: {
    title: 'Journal',
    lede: 'Notes from the workshop and the trail, written by the people who make and test the gear.',
    marker: 'MERIDIAN-JOURNAL-MARKER-1401',
  },
  about: {
    title: 'About Meridian Outfitters',
    storyTitle: 'Our story',
    story: [
      'Meridian Outfitters began in 2011 in a rented workshop above a chandlery on the Portland waterfront, with one sewing machine and a stack of surplus shell fabric. The first product was a rain shell made for a friend who guided sea kayak trips and kept wearing through the shoulders of everything else she owned.',
      'Fifteen years later we still make a deliberately small range. Six pieces, stocked all year, revised only when we learn something from a repair. We would rather sell one parka that lasts a decade than three that last a season each.',
      'The workshop is still in Portland. It is also where every repair is done, and where our CICD pipeline for the web store is maintained by the two people who also answer the phone.',
    ],
    sustainabilityTitle: 'Sustainability',
    sustainability: [
      'Repair is the whole policy. Every Meridian piece carries a repair tag with the workshop address, and mending is free for the life of the garment. In 2025 we repaired 2,140 pieces and sent 19 to be recycled because they could not be saved.',
      'Shell fabrics are recycled nylon. Down is responsibly sourced and traceable to the farm. Wool comes from three farms in Maine and Vermont that we buy from directly and visit each spring.',
      'We do not run seasonal sales and we do not destroy unsold stock. Colors that we stop making are sold at a fair price until they are gone.',
    ],
    marker: 'MERIDIAN-ABOUT-MARKER-1501',
  },
  contact: {
    title: 'Contact',
    lede: 'The workshop answers the phone during opening hours. Repairs, sizing, and order questions all come to the same place.',
    formTitle: 'Send us a message',
    marker: 'MERIDIAN-CONTACT-MARKER-1601',
  },
  harness: {
    marker: 'MERIDIAN-HARNESS-MARKER-1901',
  },
  footer: {
    default: BASE_FOOTER,
    about: BASE_FOOTER,
    journal: BASE_FOOTER,
  },
};

/* -------------------------------------------------------------------------- */
/* Copy: buggy                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The buggy copy is the clean copy with the planted violations applied on top, so
 * the two objects can never drift out of shape and an unplanted difference cannot
 * creep in by accident.
 */
const BUGGY_COPY: SiteCopy = {
  ...CLEAN_COPY,
  home: {
    ...CLEAN_COPY.home,
    // V01, rule 4: urgency phrase.
    eyebrow: 'Hurry, only a few left in every size',
    // V02, rules 2 and 5: "Cheap" plus a British spelling.
    promo: "Cheap prices on last season's colours",
    // V17, rule 3: an exclamation mark.
    whyTitle: 'Built for the long way round!',
  },
  about: {
    ...CLEAN_COPY.about,
  },
  footer: {
    default: BASE_FOOTER,
    // V15, rule 1: the wordmark lowercased, on the About page footer only.
    about: { ...BASE_FOOTER, wordmark: 'meridian outfitters' },
    // V16, rule 20: the sustainability statement omitted, on the Journal page only.
    journal: { ...BASE_FOOTER, sustainability: null },
  },
};

export const COPY: Record<SiteMode, SiteCopy> = {
  clean: CLEAN_COPY,
  buggy: BUGGY_COPY,
};

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export type ProductSlug =
  | 'ridgeline-down-parka'
  | 'basecamp-two-person-tent'
  | 'traverse-hiking-boots'
  | 'cascade-rain-shell'
  | 'harbor-wool-sweater'
  | 'timberline-daypack';

/** The three slugs that get their own page under /products/[slug]. */
export const DETAIL_SLUGS: ProductSlug[] = [
  'ridgeline-down-parka',
  'basecamp-two-person-tent',
  'traverse-hiking-boots',
];

function alt(name: string, color: string): string {
  return `${name} in ${color}, photographed on a plain bone background`;
}

const CLEAN_CARDS: Record<ProductSlug, ProductCard> = {
  'ridgeline-down-parka': {
    slug: 'ridgeline-down-parka',
    name: 'Ridgeline Down Parka',
    color: 'Moss',
    price: 'USD 448.00',
    sizes: APPAREL_SIZES,
    returns: RETURNS,
    buttonLabel: 'Add to bag',
    alt: alt('Ridgeline Down Parka', 'Moss'),
    tint: '#7A8B6F',
    blurb: 'A long winter parka for still, cold mornings and slow miles.',
  },
  'basecamp-two-person-tent': {
    slug: 'basecamp-two-person-tent',
    name: 'Basecamp Two Person Tent',
    color: 'Clay',
    price: 'USD 389.00',
    sizes: null,
    returns: RETURNS,
    buttonLabel: 'Add to bag',
    alt: alt('Basecamp Two Person Tent', 'Clay'),
    tint: '#B8643A',
    blurb: 'A three season tent that two people and a dog can sit out a storm in.',
  },
  'traverse-hiking-boots': {
    slug: 'traverse-hiking-boots',
    name: 'Traverse Hiking Boots',
    color: 'Bark',
    price: 'USD 268.00',
    sizes: APPAREL_SIZES,
    returns: RETURNS,
    buttonLabel: 'Add to bag',
    alt: alt('Traverse Hiking Boots', 'Bark'),
    tint: '#8A6A4F',
    blurb: 'Resoleable leather boots that break in over a week, not a season.',
  },
  'cascade-rain-shell': {
    slug: 'cascade-rain-shell',
    name: 'Cascade Rain Shell',
    color: 'Ash',
    price: 'USD 228.00',
    sizes: null,
    returns: RETURNS,
    buttonLabel: 'Add to bag',
    alt: alt('Cascade Rain Shell', 'Ash'),
    tint: '#9A9A92',
    blurb: 'The shell the workshop started with, now in its ninth revision.',
  },
  'harbor-wool-sweater': {
    slug: 'harbor-wool-sweater',
    name: 'Harbor Wool Sweater',
    color: 'Bone',
    price: 'USD 168.00',
    sizes: null,
    returns: RETURNS,
    buttonLabel: 'Add to bag',
    alt: alt('Harbor Wool Sweater', 'Bone'),
    tint: '#D9D2C2',
    blurb: 'Undyed wool from three farms we buy from directly.',
  },
  'timberline-daypack': {
    slug: 'timberline-daypack',
    name: 'Timberline Daypack',
    color: 'Forest',
    price: 'USD 148.00',
    sizes: null,
    returns: RETURNS,
    buttonLabel: 'Add to bag',
    alt: alt('Timberline Daypack', 'Forest'),
    tint: '#1F4D3A',
    blurb: 'Twenty two litres, one pocket, and a lid that takes a rope.',
  },
};

const CLEAN_DETAILS: Record<string, ProductDetail> = {
  'ridgeline-down-parka': {
    ...CLEAN_CARDS['ridgeline-down-parka'],
    marker: 'MERIDIAN-PRODUCT-MARKER-1301',
    material: '100 percent recycled nylon shell, 700 fill responsibly sourced down',
    description: [
      'The Ridgeline is the warmest thing Meridian makes. It is cut long enough to sit down in, with a hood that takes a hat and a hem that closes against wind off the water.',
      'Down is baffled rather than stitched through, so there is no cold seam across the chest. The shell is recycled nylon with a light finish that sheds a shower and wets out honestly in real rain, which is what the Cascade Rain Shell is for.',
      'Every parka carries a repair tag. Send it back to the workshop and we will re-baffle, re-stitch, or replace a zip for as long as the garment lasts.',
    ],
  },
  'basecamp-two-person-tent': {
    ...CLEAN_CARDS['basecamp-two-person-tent'],
    marker: 'MERIDIAN-PRODUCT-MARKER-1302',
    material: 'Silicone treated ripstop nylon fly, recycled aluminum pole set',
    description: [
      'Two doors, two vestibules, and enough head height that neither person has to be the one who sits up. The Basecamp pitches fly first, so the inner stays dry while you work.',
      'The pole set is recycled aluminum and every section is sold separately, which is the point: a snapped pole is a five dollar part rather than a new tent.',
      'Seams are taped in the workshop and re-taped for free whenever you send the fly back to us.',
    ],
  },
  'traverse-hiking-boots': {
    ...CLEAN_CARDS['traverse-hiking-boots'],
    marker: 'MERIDIAN-PRODUCT-MARKER-1303',
    material: 'Full grain leather upper, natural rubber outsole',
    description: [
      'A stitchdown boot that can be resoled three or four times before the upper gives out. The leather comes from a tannery in Maine and breaks in over about a week of ordinary walking.',
      'The outsole is natural rubber with a shallow lug, which holds on wet granite better than a deep aggressive tread and does not pack with mud.',
      'Resoling is done in Portland at cost. Send the boots back when the tread runs out and they come home ready for another few thousand miles.',
    ],
  },
};

function buggyCards(overrides: Partial<Record<ProductSlug, Partial<ProductCard>>>): Record<ProductSlug, ProductCard> {
  const next = {} as Record<ProductSlug, ProductCard>;
  for (const slug of Object.keys(CLEAN_CARDS) as ProductSlug[]) {
    next[slug] = { ...CLEAN_CARDS[slug], ...(overrides[slug] ?? {}) };
  }
  return next;
}

/**
 * Home featured cards in buggy mode.
 *
 * V03, rules 6 and 7: a bare dollar sign price ending in .99 on the first card.
 * V04, rules 3 and 11: "Buy now!" on the second card's purchase button.
 * V05, rule 8: the returns sentence dropped from the third card.
 */
const BUGGY_HOME_CARDS = buggyCards({
  'timberline-daypack': { price: '$149.99' },
  'ridgeline-down-parka': { buttonLabel: 'Buy now!' },
  'basecamp-two-person-tent': { returns: null },
});

/**
 * Shop cards in buggy mode.
 *
 * V06, rule 9: the boots name, and its alt text, in lowercase.
 * V07, rule 10: the parka sizes out of order.
 * V08, rule 11: "Add to cart" on the rain shell.
 */
const BUGGY_SHOP_CARDS = buggyCards({
  'traverse-hiking-boots': {
    name: 'traverse hiking boots',
    alt: alt('traverse hiking boots', 'Bark'),
  },
  'ridgeline-down-parka': { sizes: ['M', 'S', 'L', 'XS', 'XL'] },
  'cascade-rain-shell': { buttonLabel: 'Add to cart' },
});

/**
 * Product pages in buggy mode.
 *
 * V09, rule 12: the parka loses its fabric composition line.
 * V10, rule 6: the tent price loses its decimals.
 */
const BUGGY_DETAILS: Record<string, ProductDetail> = {
  ...CLEAN_DETAILS,
  'ridgeline-down-parka': { ...CLEAN_DETAILS['ridgeline-down-parka'], material: null },
  'basecamp-two-person-tent': { ...CLEAN_DETAILS['basecamp-two-person-tent'], price: 'USD 389' },
};

/** The order the home page shows its three featured cards in. */
export const FEATURED_ORDER: ProductSlug[] = [
  'timberline-daypack',
  'ridgeline-down-parka',
  'basecamp-two-person-tent',
];

/** The order the shop grid shows its six cards in. */
export const SHOP_ORDER: ProductSlug[] = [
  'ridgeline-down-parka',
  'basecamp-two-person-tent',
  'traverse-hiking-boots',
  'cascade-rain-shell',
  'harbor-wool-sweater',
  'timberline-daypack',
];

export interface ProductData {
  featured: ProductCard[];
  shop: ProductCard[];
  detail: Record<string, ProductDetail>;
}

export const PRODUCTS: Record<SiteMode, ProductData> = {
  clean: {
    featured: FEATURED_ORDER.map((slug) => CLEAN_CARDS[slug]),
    shop: SHOP_ORDER.map((slug) => CLEAN_CARDS[slug]),
    detail: CLEAN_DETAILS,
  },
  buggy: {
    featured: FEATURED_ORDER.map((slug) => BUGGY_HOME_CARDS[slug]),
    shop: SHOP_ORDER.map((slug) => BUGGY_SHOP_CARDS[slug]),
    detail: BUGGY_DETAILS,
  },
};

/* -------------------------------------------------------------------------- */
/* Journal                                                                     */
/* -------------------------------------------------------------------------- */

const CLEAN_JOURNAL: JournalEntry[] = [
  {
    title: 'How we re-baffle a down parka',
    author: 'By Tom Alder',
    date: '4 September 2026',
    excerpt:
      'A cold spot across the chest usually means the down has migrated rather than escaped. Here is the bench process we use to move it back and close the baffle without opening the shell.',
    // Cross document decoy: TechNova rule 9 bans a bare "Learn More" label. Meridian is silent.
    linkLabel: 'Learn More',
    href: '/journal',
  },
  {
    title: 'Three farms, one sweater',
    author: 'By Priya Raman',
    date: '21 August 2026',
    excerpt:
      'We buy wool from three farms, two in Maine and one in Vermont, and visit each of them in the spring. This is what that buying trip looks like and why the sweater is undyed.',
    // Cross document decoy: the second bare "Learn More".
    linkLabel: 'Learn More',
    href: '/journal',
  },
  {
    title: 'A week on the coast trail in the Basecamp',
    author: 'By Elena Marsh',
    date: '2 August 2026',
    excerpt:
      'Seven nights, four of them wet, and one pole section replaced in the field. Notes on what the tent did well and the two things we are changing for the next run.',
    linkLabel: 'Read the entry',
    href: '/journal',
  },
];

/** V11, rule 21: the third entry loses its author byline. */
const BUGGY_JOURNAL: JournalEntry[] = CLEAN_JOURNAL.map((entry, index) =>
  index === 2 ? { ...entry, author: null } : entry,
);

export const JOURNAL: Record<SiteMode, JournalEntry[]> = {
  clean: CLEAN_JOURNAL,
  buggy: BUGGY_JOURNAL,
};

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */

const CLEAN_CONTACT: ContactDetails = {
  address: ADDRESS,
  hours: HOURS,
  telLabel: TEL_LABEL,
  telHref: TEL_HREF,
  submitLabel: 'Send message',
};

/**
 * V12, rule 22: an abbreviated address with no ZIP code.
 * V13, rule 23: hyphenated days and times.
 * V14, rule 25: a bare "Submit" on the form button.
 *
 * Note that only the contact page body carries these. The shared footer keeps the
 * canonical address and hours on every page, including this one, so each planted
 * violation stays on the single page the register says it is on.
 */
const BUGGY_CONTACT: ContactDetails = {
  ...CLEAN_CONTACT,
  address: '88 Harbor St., Portland Maine',
  hours: 'Mon-Sat 9-6',
  submitLabel: 'Submit',
};

export const CONTACT: Record<SiteMode, ContactDetails> = {
  clean: CLEAN_CONTACT,
  buggy: BUGGY_CONTACT,
};
