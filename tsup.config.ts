import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "rubika-cf/index.ts",
    errors: "rubika-cf/errors.ts",
    "types/enums": "rubika-cf/types/enums.ts",
  },
  format: ["esm"],
  target: "esnext",
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});