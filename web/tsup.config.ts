import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/nodes/setting/setting.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: "esm",
  external: [/^@comfyUI/],
});
