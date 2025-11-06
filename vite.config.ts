/// <reference types="vitest/config" />
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import tsconfigPaths from "vite-tsconfig-paths";
import { ASSET_HOST } from "./env";

export default defineConfig({
  base: ASSET_HOST,
  plugins: [
    !process.env["VITEST"] && reactRouter(),
    environment({
      // Environment variables to include in the bundle.
    }),
    tsconfigPaths(),
  ],
  test: {
    mockReset: true,
    reporters: ["dot"],
    setupFiles: ["./test/setup.ts"],
  },
});
