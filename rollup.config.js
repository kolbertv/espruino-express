import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
// import obfuscator from "rollup-plugin-obfuscator";

export default {
  input: "index.js",
  output: [
    {
      file: "build/bundle.js",
      format: "cjs"
    },
    {
      file: "build/bundle.min.js",
      format: "cjs",
      plugins: [terser()]
    }
  ],
  plugins: [resolve(), babel()]
};
