import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COPY, DETAIL_SLUGS, PRODUCTS } from '@/content/copy';
import { getSiteMode } from '@/lib/site-mode';
import content from '../../components/content.module.css';
import {
  PageMarkerLine,
  ProductArt,
  SiteFooter,
  SiteHeader,
  chrome,
} from '../../components/site-chrome';

/**
 * Three products have a page of their own, and the set is fixed, so every one of
 * them is prerendered at build time and anything else is a 404 rather than a
 * runtime render of a product that does not exist.
 */
export function generateStaticParams() {
  return DETAIL_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS[getSiteMode()].detail[slug];
  if (!product) {
    return { title: 'Product not found' };
  }
  return {
    title: product.name,
    description: product.blurb,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mode = getSiteMode();
  const copy = COPY[mode];
  const product = PRODUCTS[mode].detail[slug];

  if (!product) {
    notFound();
  }

  return (
    <div className={chrome.page}>
      <SiteHeader links={copy.nav.links} cta={copy.nav.cta} ctaHref={copy.nav.ctaHref} />

      <main id="main" className={`${chrome.shell} ${chrome.main}`}>
        <p className={content.pageLede}>
          <a href="/shop">Back to the shop</a>
        </p>

        <div className={content.productLayout}>
          <div className={content.productArtFrame}>
            <ProductArt alt={product.alt} tint={product.tint} />
          </div>

          <div>
            <h1>{product.name}</h1>
            <p className={content.productColor}>{`Color: ${product.color}`}</p>
            <p className={content.productPrice}>{product.price}</p>

            <div className={content.specList}>
              {product.sizes === null ? null : (
                <div className={content.specRow}>
                  <span className={content.specKey}>Sizes</span>
                  <p className={content.specValue}>{product.sizes.join(', ')}</p>
                </div>
              )}
              {product.material === null ? null : (
                <div className={content.specRow}>
                  <span className={content.specKey}>Composition</span>
                  <p className={content.specValue}>{product.material}</p>
                </div>
              )}
              <div className={content.specRow}>
                <span className={content.specKey}>Repairs</span>
                <p className={content.specValue}>
                  Free for the life of the garment at the Portland workshop.
                </p>
              </div>
            </div>

            <div className={content.productActions}>
              <button type="button" className={chrome.buttonPrimary}>
                {product.buttonLabel}
              </button>
              {product.returns === null ? null : (
                <p className={content.productReturns}>{product.returns}</p>
              )}
            </div>
          </div>
        </div>

        <section className={content.productDescription} aria-labelledby="description-title">
          <h2 id="description-title">Description</h2>
          {product.description.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </section>

        <PageMarkerLine marker={product.marker} />
      </main>

      <SiteFooter copy={copy.footer.default} />
    </div>
  );
}
