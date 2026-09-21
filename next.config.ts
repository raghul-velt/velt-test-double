import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

/**
 * Pin the Turbopack root to this repository.
 *
 * Without it Turbopack walks up looking for a lockfile, can settle on a parent
 * directory's one, and warns on every build. This repo is self contained, so the
 * root is simply the directory this file lives in.
 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
