import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === "lib" ? "./" : "/tiptap-editor/",
    plugins: [react(), ...(mode === "lib" ? [dts({ include: ["src"], tsconfigPath: "./tsconfig.app.json" })] : [])],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    ...(mode === "lib"
      ? {
          build: {
            lib: {
              entry: path.resolve(__dirname, "src/index.ts"),
              name: "TiptapEditorLibrary",
              fileName: (format) => `tiptap-editor-library.${format}.js`,
            },
            rollupOptions: {
              external: ["react", "react-dom"],
              output: {
                globals: {
                  react: "React",
                  "react-dom": "ReactDOM",
                },
              },
            },
          },
        }
      : {}),
  };
});
