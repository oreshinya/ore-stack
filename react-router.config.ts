import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // CSRF is enforced by the Origin/Sec-Fetch-Site middleware in server/index.ts,
  // which compares against HOST. React Router's own check compares against the
  // request URL, which reports http behind a TLS-terminating proxy, so it is
  // disabled here to keep a single source of truth.
  allowedActionOrigins: ["**"],
} satisfies Config;
