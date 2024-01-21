import { defineConfig } from "tsup";
// 自动增加后缀
function formatImportPath(path: string) {
  if (!/[\.](js|ts)$/.test(path)) {
    return path + ".js";
  }
  return path;
}
export default defineConfig({
  entry: ["src/nodes/setting/index.ts", "src/nodes/prompt/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: "esm",
  esbuildOptions: (options) => {
    // 维持 js 后缀, 默认是 cjs
    options.outExtension = { ".js": ".js" };
  },
  esbuildPlugins: [
    {
      name: "alias",
      setup(build) {
        // 自动替换 @comfyUI 路径
        build.onResolve({ filter: /^@comfyUI/ }, (args) => {
          return {
            // 替换为 url 相对路径, 用于动态 import 导入
            path: formatImportPath(args.path).replace(/^@comfyUI/, "../../.."),
            external: true,
          };
        });
      },
    },
  ],
});
