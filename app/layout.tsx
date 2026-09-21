import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getSuperflowEnvStatus } from '@/lib/site-mode';

/**
 * Rule 15 of the Meridian brand document: headings in Fraunces, a serif, and body
 * copy in Work Sans. Both are self hosted by next/font, so no request leaves the
 * visitor's browser for a font file.
 */
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Meridian Outfitters',
    template: '%s, Meridian Outfitters',
  },
  description:
    'Meridian Outfitters makes a small run of outdoor clothing and shelter in Portland, Maine, built to be repaired rather than replaced.',
};

/**
 * The Superflow toolbar embed.
 *
 * Both values come from the environment and neither is ever hardcoded. If either is
 * missing the script tag is not rendered at all, because a toolbar URL with an empty
 * apiKey or projectId is worse than no toolbar: it looks installed and is not.
 * The /harness page reports which of the two is missing.
 */
function SuperflowToolbar() {
  const { ready } = getSuperflowEnvStatus();
  if (!ready) {
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_SUPERFLOW_API_KEY as string;
  const projectId = process.env.NEXT_PUBLIC_SUPERFLOW_PROJECT_ID as string;
  const src =
    'https://cdn.jsdelivr.net/npm/@usesuperflow/toolbar-staging/superflow.min.js' +
    `?apiKey=${apiKey}&projectId=${projectId}`;

  return <Script id="superflowToolbarScript" src={src} data-sf-platform="other-manual" async />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>
        <a className="skipLink" href="#main">
          Skip to main content
        </a>
        {children}
        <SuperflowToolbar />
      </body>
    </html>
  );
}
