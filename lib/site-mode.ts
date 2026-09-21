/**
 * The single place the site decides whether it is serving the clean brand-compliant
 * copy or the copy with the planted guideline violations.
 *
 * The mode comes from the SITE_MODE environment variable, read server side only.
 * It is deliberately NOT prefixed with NEXT_PUBLIC_, so the value never reaches the
 * browser bundle and never appears in client JavaScript.
 *
 * Unset means "buggy". That is the useful default for a test property: a fresh
 * deploy with no configuration serves the copy an agent is supposed to find fault
 * with, and turning the site clean is the deliberate act.
 *
 * Because every page in this app is a server component that is statically generated,
 * the value is read at build time. Changing SITE_MODE therefore needs a redeploy,
 * which is exactly what scripts/set-mode.sh does in one command.
 */

export type SiteMode = 'clean' | 'buggy';

export const DEFAULT_SITE_MODE: SiteMode = 'buggy';

/** The mode this build is serving. Anything other than "clean" is treated as buggy. */
export function getSiteMode(): SiteMode {
  const raw = process.env.SITE_MODE;
  return raw !== undefined && raw.trim().toLowerCase() === 'clean' ? 'clean' : DEFAULT_SITE_MODE;
}

/** Convenience wrapper for the places that only care whether violations are planted. */
export function isBuggy(): boolean {
  return getSiteMode() === 'buggy';
}

/**
 * Whether the two Superflow toolbar variables are set, without ever revealing them.
 * The harness page reports these booleans and the root layout uses them to decide
 * whether it can render the toolbar script tag at all.
 */
export function getSuperflowEnvStatus(): {
  apiKeyPresent: boolean;
  projectIdPresent: boolean;
  ready: boolean;
} {
  const apiKeyPresent = Boolean(process.env.NEXT_PUBLIC_SUPERFLOW_API_KEY);
  const projectIdPresent = Boolean(process.env.NEXT_PUBLIC_SUPERFLOW_PROJECT_ID);
  return { apiKeyPresent, projectIdPresent, ready: apiKeyPresent && projectIdPresent };
}
