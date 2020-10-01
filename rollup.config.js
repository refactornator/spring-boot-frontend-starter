import path from "path";
import svelte from "rollup-plugin-svelte";
import html from "@rollup/plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereloadClient from "rollup-plugin-livereload-client";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;
const staticDir = path.resolve(__dirname, "src/main/resources/static");

export default {
  input: "frontend/index.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    dir: staticDir,
  },
  plugins: [
    svelte({
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("bundle.css");
      },
    }),

    html({
      title: "My App",
    }),

    livereloadClient({ include: !production }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
