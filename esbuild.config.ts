import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./server/index.ts", "./tasks/*.ts"],
  bundle: true,
  splitting: true,
  platform: "node",
  packages: "external",
  external: ["./build/*"],
  format: "esm",
  outdir: "./dist",
  entryNames: "[dir]-[name]",
});
