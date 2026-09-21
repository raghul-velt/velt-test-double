#!/usr/bin/env bash
#
# Flip the Meridian Outfitters test property between its two modes, with no commit.
#
#   ./scripts/set-mode.sh clean
#   ./scripts/set-mode.sh buggy
#
# SITE_MODE is a plain production environment variable on Vercel, so the switch is
# three CLI calls: remove the old value, add the new one, redeploy. Nothing is
# committed and nothing in app/ changes. This is the whole difference in testing
# architecture from the sibling property at velt-agent-test-site, which switches by
# committing one of two variant files over app/page.tsx from a GitHub Actions job.
#
# Every page is statically generated, so the redeploy at the end is not optional.
# Without it the site keeps serving the HTML built with the previous value.

set -euo pipefail

SCOPE="velt-team-eng"
MODE="${1:-}"

if [[ "${MODE}" != "clean" && "${MODE}" != "buggy" ]]; then
  echo "Usage: $(basename "$0") <clean|buggy>" >&2
  echo "" >&2
  echo "  clean  brand compliant copy, no planted violations" >&2
  echo "  buggy  the 17 planted Meridian guideline violations (the default when SITE_MODE is unset)" >&2
  exit 2
fi

echo "Setting SITE_MODE=${MODE} on production (scope ${SCOPE})"

# Remove first. `vercel env add` does not overwrite, and a removal when nothing is
# set is not an error worth stopping for.
npx vercel env rm SITE_MODE production --scope "${SCOPE}" --yes || true

printf '%s' "${MODE}" | npx vercel env add SITE_MODE production --scope "${SCOPE}"

echo "Redeploying so the statically generated pages pick the new value up"
npx vercel --prod --yes --scope "${SCOPE}"

echo ""
echo "Done. Confirm with:"
echo "  node scripts/verify-site.mjs <your production URL>"
