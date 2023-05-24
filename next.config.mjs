/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

// "https://oaidalleapiprodscus.blob.core.windows.net/private/org-xWG1DUvbA9Ejd0dZCXhPfHO4/user-sflEvR1IwPOxaEzByAeiFoas/img-v6LpEydkZtqrpKbUeWAf1dP9.png?st=2023-05-20T22%3A04%3A34Z&se=2023-05-21T00%3A04%3A34Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-20T11%3A03%3A23Z&ske=2023-05-21T11%3A03%3A23Z&sks=b&skv=2021-08-06&sig=afIa82mRnvBtSnadSew%2B1rz4lbQO114jOgHSbcbLkns%3D";
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
    ],
  },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
