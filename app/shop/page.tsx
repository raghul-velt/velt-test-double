import type { Metadata } from 'next';
import { COPY, PRODUCTS } from '@/content/copy';
import { getSiteMode } from '@/lib/site-mode';
import content from '../components/content.module.css';
import {
  PageMarkerLine,
  ProductCardView,
  SiteFooter,
  SiteHeader,
  chrome,
} from '../components/site-chrome';

export const metadata: Metadata = {
  title: 'Shop',
};

export default function ShopPage() {
  const mode = getSiteMode();
  const copy = COPY[mode];
  const products = PRODUCTS[mode].shop;

  return (
    <div className={chrome.page}>
      <SiteHeader links={copy.nav.links} cta={copy.nav.cta} ctaHref={copy.nav.ctaHref} />

      <main id="main" className={`${chrome.shell} ${chrome.main}`}>
        <div className={content.pageHead}>
          <h1>{copy.shop.title}</h1>
          <p className={content.pageLede}>{copy.shop.lede}</p>
        </div>

        <section aria-label="Product grid">
          <div className={chrome.productGrid}>
            {products.map((product) => (
              <ProductCardView key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <PageMarkerLine marker={copy.shop.marker} />
      </main>

      <SiteFooter copy={copy.footer.default} />
    </div>
  );
}
