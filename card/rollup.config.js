import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

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
  ],
};
