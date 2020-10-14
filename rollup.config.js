import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";

const input = "./src/Cmi5.ts";

const extensions = [".js", ".ts"];

const resolveOptions = {
  extensions: extensions,
};

const babelPluginOptions = {
  babelHelpers: "bundled",
  extensions: extensions,
};

export default [
  {
    input: input,
    plugins: [
      resolve({
        ...resolveOptions,
        browser: true,
      }),
      commonjs(), // Used for Axios import
      babel(babelPluginOptions),
      terser(),
    ],
    output: [
      {
        file: pkg.browser,
        format: "umd",
        name: "Cmi5",
      },
      {
        file: pkg.module,
        format: "esm",
        exports: "default",
      },
    ],
  },
];
