import type { Metadata } from 'next';
import { COPY } from '@/content/copy';
import { getSiteMode } from '@/lib/site-mode';
import content from '../components/content.module.css';
import { PageMarkerLine, SiteFooter, SiteHeader, chrome } from '../components/site-chrome';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  const mode = getSiteMode();
  const copy = COPY[mode];
  const about = copy.about;

  return (
    <div className={chrome.page}>
      <SiteHeader links={copy.nav.links} cta={copy.nav.cta} ctaHref={copy.nav.ctaHref} />

      <main id="main" className={`${chrome.shell} ${chrome.main}`}>
        <div className={content.pageHead}>
          <h1>{about.title}</h1>
        </div>

        <section className={content.block} aria-labelledby="story-title">
          <h2 id="story-title">{about.storyTitle}</h2>
          <div className={content.prose}>
            {about.story.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className={content.blockLast} aria-labelledby="sustainability-title">
          <h2 id="sustainability-title">{about.sustainabilityTitle}</h2>
          <div className={content.prose}>
            {about.sustainability.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <PageMarkerLine marker={about.marker} />
      </main>

      <SiteFooter copy={copy.footer.about} />
    </div>
  );
}
