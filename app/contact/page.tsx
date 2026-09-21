import type { Metadata } from 'next';
import { CONTACT, COPY } from '@/content/copy';
import { getSiteMode } from '@/lib/site-mode';
import content from '../components/content.module.css';
import { PageMarkerLine, SiteFooter, SiteHeader, chrome } from '../components/site-chrome';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  const mode = getSiteMode();
  const copy = COPY[mode];
  const details = CONTACT[mode];

  return (
    <div className={chrome.page}>
      <SiteHeader links={copy.nav.links} cta={copy.nav.cta} ctaHref={copy.nav.ctaHref} />

      <main id="main" className={`${chrome.shell} ${chrome.main}`}>
        <div className={content.pageHead}>
          <h1>{copy.contact.title}</h1>
          <p className={content.pageLede}>{copy.contact.lede}</p>
        </div>

        <div className={content.contactLayout}>
          <section aria-labelledby="details-title">
            <h2 id="details-title">The workshop</h2>

            <div className={content.detailGroup}>
              <p className={content.detailLabel}>Address</p>
              <address style={{ fontStyle: 'normal' }}>{details.address}</address>
            </div>

            <div className={content.detailGroup}>
              <p className={content.detailLabel}>Hours</p>
              <p>{details.hours}</p>
            </div>

            <div className={content.detailGroup}>
              <p className={content.detailLabel}>Telephone</p>
              <p>
                <a href={details.telHref}>{details.telLabel}</a>
              </p>
            </div>
          </section>

          <section aria-labelledby="form-title">
            <h2 id="form-title">{copy.contact.formTitle}</h2>
            {/*
              No backend on this property. The form posts to "#" so the page stays a
              static document and the button is still a real submit control.
            */}
            <form className={content.form} action="#" method="get">
              <div className={content.field}>
                <label htmlFor="contact-name">Your name</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className={content.field}>
                <label htmlFor="contact-email">Email address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className={content.field}>
                <label htmlFor="contact-order">Order number, if you have one</label>
                <input id="contact-order" name="order" type="text" />
              </div>
              <div className={content.field}>
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" required />
              </div>
              <div className={content.formActions}>
                <button type="submit" className={chrome.buttonPrimary}>
                  {details.submitLabel}
                </button>
              </div>
            </form>
          </section>
        </div>

        <PageMarkerLine marker={copy.contact.marker} />
      </main>

      <SiteFooter copy={copy.footer.default} />
    </div>
  );
}
