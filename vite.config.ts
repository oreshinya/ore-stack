import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import environment from "vite-plugin-environment";
import { ASSET_HOST } from "./env";

export default defineConfig({
  base: ASSET_HOST,
  plugins: [
    !process.env["VITEST"] && reactRouter(),
    environment({
      // Environment variables to include in the bundle.
    }),
    tsconfigPaths()
  ],
});
