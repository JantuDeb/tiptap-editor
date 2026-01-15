import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === "lib" ? "./" : "/tiptap-editor/",
    plugins: [react()],
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
