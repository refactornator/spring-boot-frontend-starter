import path from "path";
import copy from "rollup-plugin-copy";
import svelte from "rollup-plugin-svelte";
import cleaner from "rollup-plugin-cleaner";
import html from "@open-wc/rollup-plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
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
    cleaner({
      targets: [staticDir],
    }),

    !production &&
      copy({
        targets: [
          {
            src: "node_modules/livereload-js/dist/livereload.js",
            dest: staticDir,
          },
        ],
      }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("bundle.css");
      },
    }),

    html({
      title: "My App",
      transform: (html) =>
        production
          ? html
          : html.replace(
              "</body>",
              '<script src="./livereload.js?port=35729"></script></body>'
            ),
    }),

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

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
