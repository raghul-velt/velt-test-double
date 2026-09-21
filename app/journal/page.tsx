import type { Metadata } from 'next';
import { COPY, JOURNAL } from '@/content/copy';
import { getSiteMode } from '@/lib/site-mode';
import content from '../components/content.module.css';
import { PageMarkerLine, SiteFooter, SiteHeader, chrome } from '../components/site-chrome';

export const metadata: Metadata = {
  title: 'Journal',
};

export default function JournalPage() {
  const mode = getSiteMode();
  const copy = COPY[mode];
  const entries = JOURNAL[mode];

  return (
    <div className={chrome.page}>
      <SiteHeader links={copy.nav.links} cta={copy.nav.cta} ctaHref={copy.nav.ctaHref} />

      <main id="main" className={`${chrome.shell} ${chrome.main}`}>
        <div className={content.pageHead}>
          <h1>{copy.journal.title}</h1>
          <p className={content.pageLede}>{copy.journal.lede}</p>
        </div>

        <ul className={content.journalList}>
          {entries.map((entry) => (
            <li key={entry.title} className={content.journalEntry}>
              <h2>{entry.title}</h2>
              <p className={content.journalMeta}>
                {entry.author === null ? entry.date : `${entry.author}, ${entry.date}`}
              </p>
              <p className={content.journalExcerpt}>{entry.excerpt}</p>
              <a href={entry.href} className={content.journalLink}>
                {entry.linkLabel}
              </a>
            </li>
          ))}
        </ul>

        <PageMarkerLine marker={copy.journal.marker} />
      </main>

      <SiteFooter copy={copy.footer.journal} />
    </div>
  );
}
