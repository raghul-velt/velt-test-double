/**
 * The chrome every page shares: header, footer, product card, product placeholder
 * art, and the marker line.
 *
 * None of these components know which site mode is running. Each one renders the
 * copy object it is handed, which is what keeps the clean and buggy builds a data
 * difference rather than a code difference.
 */

import type { FooterCopy, NavLink, ProductCard, ProductSlug } from '@/content/copy';
import { DETAIL_SLUGS } from '@/content/copy';
import styles from './ui.module.css';

/* ---------------------------------------------------------------- header -- */

export function SiteHeader({
  links,
  cta,
  ctaHref,
}: {
  links: NavLink[];
  cta: string;
  ctaHref: string;
}) {
  return (
    <header className={styles.header}>
      <div className={`${styles.shell} ${styles.headerInner}`}>
        <a href="/" className={styles.wordmark}>
          Meridian Outfitters
        </a>
        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={ctaHref} className={styles.buttonPrimary}>
            {cta}
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- footer -- */

export function SiteFooter({ copy }: { copy: FooterCopy }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.footerWordmark}>{copy.wordmark}</p>
            {copy.sustainability === null ? null : (
              <p className={styles.footerSustainability}>{copy.sustainability}</p>
            )}
          </div>
          <div>
            <h2 className={styles.footerHeading}>Workshop</h2>
            <address className={styles.footerLine} style={{ fontStyle: 'normal' }}>
              {copy.address}
            </address>
            <p className={styles.footerLine}>{copy.hours}</p>
          </div>
          <div>
            <h2 className={styles.footerHeading}>Talk to us</h2>
            <p className={styles.footerLine}>
              <a href={copy.telHref}>{copy.telLabel}</a>
            </p>
            <p className={styles.footerLine}>
              <a href="/contact">Contact the workshop</a>
            </p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>{copy.copyright}</span>
          <span>Portland, Maine</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- marker -- */

/**
 * The per page marker sentence. It is rendered as one text node on purpose, so a
 * DOM text extraction and a raw HTML search both see the same contiguous string.
 */
export function PageMarkerLine({ marker }: { marker: string }) {
  return <p className={styles.marker}>{`Reference: ${marker}`}</p>;
}

/* ------------------------------------------------------------ product art -- */

/**
 * The stand in for a product photograph.
 *
 * Rule 17 asks for products on a plain bone background and forbids lifestyle
 * photography on a product card, so this is a bone panel with a simple silhouette
 * in the product color. Rule 18 asks for alternative text naming the product and
 * its color, so the same sentence is both the accessible name and the SVG title.
 * Nothing is fetched over the network.
 */
export function ProductArt({ alt, tint }: { alt: string; tint: string }) {
  return (
    <svg
      className={styles.cardArt}
      viewBox="0 0 320 240"
      role="img"
      aria-label={alt}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <rect x="0" y="0" width="320" height="240" fill="#F3EFE6" />
      <rect x="96" y="54" width="128" height="132" rx="2" fill={tint} opacity="0.92" />
      <rect x="96" y="54" width="128" height="26" rx="2" fill="#1B1B1B" opacity="0.12" />
      <line x1="160" y1="80" x2="160" y2="186" stroke="#F3EFE6" strokeWidth="2" opacity="0.7" />
      <circle cx="160" cy="200" r="5" fill={tint} opacity="0.55" />
    </svg>
  );
}

/* ----------------------------------------------------------- product card -- */

/**
 * Three of the six products have a page of their own under /products/[slug]. The
 * other three are catalogue only, so their card points back at the shop rather than
 * at an address that does not exist.
 */
function cardHref(slug: string): string {
  return DETAIL_SLUGS.includes(slug as ProductSlug) ? `/products/${slug}` : '/shop';
}

export function ProductCardView({ product }: { product: ProductCard }) {
  const href = cardHref(product.slug);
  return (
    <article className={styles.card}>
      <ProductArt alt={product.alt} tint={product.tint} />
      <h3 className={styles.cardName}>
        <a href={href} className={styles.cardNameLink}>
          {product.name}
        </a>
      </h3>
      <p className={styles.cardColor}>{`Color: ${product.color}`}</p>
      <p className={styles.cardPrice}>{product.price}</p>
      <p className={styles.cardBlurb}>{product.blurb}</p>
      {product.sizes === null ? null : (
        <p className={styles.cardSizes}>{`Sizes: ${product.sizes.join(', ')}`}</p>
      )}
      {product.returns === null ? null : (
        <p className={styles.cardReturns}>{product.returns}</p>
      )}
      <div className={styles.cardActions}>
        <a href={href} className={styles.buttonPrimary}>
          {product.buttonLabel}
        </a>
      </div>
    </article>
  );
}

export { styles as chrome };
