import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// 自动增加后缀
function formatImportPath(path: string) {
  if (!/[\.](js|ts)$/.test(path)) {
    return path + ".js";
  }
  return path;
}
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // a hacky resolution for reactDOM process is not defined error
    // "process.env.NODE_ENV": '"production"',
  },
  appType: "custom",
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  optimizeDeps: {
    entries: ["react", "react-dom"],
  },
  build: {
    watch: {
      include: ["src/**"],
    },
    minify: false, // ___DEBUG__MODE only
    // sourcemap: true, // ___DEBUG___MODE only
    emptyOutDir: true,
    rollupOptions: {
      // externalize deps that shouldn't be bundled into your library
      // external: ["@comfyUI"],
      input: ["./src/nodes/prompt", "./src/nodes/setting"],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          app: "app",
          LiteGraph: "LiteGraph",
          LGraphNode: "LGraphNode",
          LGraphCanvas: "LGraphCanvas",
        },
        dir: "dist",
        entryFileNames: (entry) => {
          // 使用正则表达式提取当前文件所在文件夹的信息
          if (entry.facadeModuleId) {
            const folderName = path.basename(
              path.dirname(entry.facadeModuleId)
            );
            return `${folderName}/[name].js`;
          }
          return "[name]-[hash].js";
        },
        chunkFileNames: (chunk) => {
          // 使用正则表达式提取当前文件所在文件夹的信息
          if (chunk.facadeModuleId) {
            const folderName = path.basename(
              path.dirname(chunk.facadeModuleId)
            );
            return `${folderName}/[name].js`;
          }
          return "[name]-[hash].js";
        },
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  plugins: [
    {
      name: "alias-importer",
      enforce: "pre",
      resolveId(source) {
        // 判断是否是以 '@comfyUI' 开头的路径
        if (source.includes("@comfyUI")) {
          // 不将路径作为依赖项打包
          return {
            id: formatImportPath(source.replace("@comfyUI", "../../..")),
            external: true,
          };
        }
        return null;
      },
    },
    react(),
    splitVendorChunkPlugin(),
  ],
});
