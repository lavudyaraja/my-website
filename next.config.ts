import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * It's highly recommended to keep Strict Mode enabled to detect potential
   * problems in your application early.
   * @see https://react.dev/reference/react/StrictMode
   */
  reactStrictMode: true,
  outputFileTracing: false,
  // The `experimental.turbo` option has been removed from `next.config.js`.
  // This was causing the TypeScript error. To use Turbopack for local
  // development, run `next dev --turbo` from your command line.
};

export default nextConfig;