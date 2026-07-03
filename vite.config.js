import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Mirrors openimis-fe-claim_js's build config -- same lib-mode vite build,
// same peer libs externalized so the assembly's single copy of
// react/mui/redux/etc gets used instead of a bundled duplicate (bundling
// them causes runtime errors, see openimis-fe_js's AGENTS.md).
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      jsxImportSource: "@emotion/react",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.jsx"),
      name: "OpenIMISFeClaimGuard",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "es" : "cjs"}.js`,
    },
    sourcemap: true,
    outDir: "dist",
    rollupOptions: {
      external: [
        /^react.*/,
        /^redux.*/,
        "react-intl",
        "prop-types",
        /^@mui\/material/,
        /^@mui\/icons-material/,
        /^@emotion\/react/,
        /^@emotion\/styled/,
        "@openimis/fe-core",
        /^@openimis.*/,
      ],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
