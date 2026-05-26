import { cpSync } from "node:fs";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

// Copy the built bundle into the integration's frontend/ so HA serves the
// fresh JS on the next page load (or right away in dev with a symlinked
// custom_components/smart_alarm). Runs after every build AND every watch
// rebuild.
const copyToIntegration = {
  name: "copy-to-integration",
  writeBundle() {
    cpSync(
      "dist/smart-alarm-card.js",
      "../custom_components/smart_alarm/frontend/smart-alarm-card.js",
    );
  },
};

export default {
  input: "src/smart-alarm-card.ts",
  output: {
    file: "dist/smart-alarm-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser({
      format: { comments: false },
      mangle: { properties: false },
    }),
    copyToIntegration,
  ],
};
