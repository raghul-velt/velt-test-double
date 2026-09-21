import type { Metadata } from 'next';
import { COPY, JOURNAL, PRODUCTS } from '@/content/copy';
import { getSiteMode } from '@/lib/site-mode';
import {
  PageMarkerLine,
  ProductCardView,
  SiteFooter,
  SiteHeader,
  chrome,
} from './components/site-chrome';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Outdoor gear made to be repaired',
};

export default function HomePage() {
  const mode = getSiteMode();
  const copy = COPY[mode];
  const home = copy.home;
  const featured = PRODUCTS[mode].featured;
  const journalPreview = JOURNAL[mode].slice(0, 2);

  return (
    <div className={chrome.page}>
      <SiteHeader links={copy.nav.links} cta={copy.nav.cta} ctaHref={copy.nav.ctaHref} />

      <main id="main" className={`${chrome.shell} ${chrome.main}`}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}>{home.eyebrow}</p>
          <h1 id="hero-title">{home.title}</h1>
          <p className={styles.heroLede}>{home.lede}</p>
          <p className={styles.promo}>{home.promo}</p>
          <div className={styles.heroActions}>
            <a href="/shop" className={chrome.buttonPrimary}>
              {copy.nav.cta}
            </a>
            <a href="/about" className={chrome.buttonSecondary}>
              Read our story
            </a>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="why-title">
          <h2 id="why-title" className={chrome.sectionTitle}>
            {home.whyTitle}
          </h2>
          <p className={styles.sectionLede}>Why Meridian, in three lines.</p>
          <ul className={styles.whyRow}>
            {home.whyPoints.map((point) => (
              <li key={point.title} className={styles.whyPoint}>
                <span className={styles.whyIcon} role="img" aria-label={point.iconLabel}>
                  {point.icon}
                </span>
                <h3>{point.title}</h3>
                <p className={styles.whyBody}>{point.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="featured-title">
          <h2 id="featured-title" className={chrome.sectionTitle}>
            {home.featuredTitle}
          </h2>
          <p className={styles.sectionLede}>{home.featuredLede}</p>
          <div className={chrome.productGrid}>
            {featured.map((product) => (
              <ProductCardView key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="journal-title">
          <h2 id="journal-title" className={chrome.sectionTitle}>
            {home.journalTitle}
          </h2>
          <p className={styles.sectionLede}>{home.journalLede}</p>
          <ul className={styles.journalRow}>
            {journalPreview.map((entry) => (
              <li key={entry.title} className={styles.journalCard}>
                <h3>{entry.title}</h3>
                <p className={styles.journalMeta}>
                  {entry.author === null ? entry.date : `${entry.author}, ${entry.date}`}
                </p>
                <p className={styles.journalExcerpt}>{entry.excerpt}</p>
                <a href={entry.href} className={styles.journalLink}>
                  {entry.linkLabel}
                </a>
              </li>
            ))}
          </ul>
          <PageMarkerLine marker={home.marker} />
        </section>
      </main>

      <SiteFooter copy={copy.footer.default} />
    </div>
  );
}
