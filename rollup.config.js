import fs from "fs-extra";
import path from "path";
import svelte from "rollup-plugin-svelte";
import cleaner from "rollup-plugin-cleaner";
import html from "@rollup/plugin-html";
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

    !production && {
      name: "inject-livereload",
      generateBundle(options, bundle) {
        const index = bundle["index.html"];
        if (index) {
          fs.copy(
            "node_modules/livereload-js/dist/livereload.js",
            `${staticDir}/livereload.js`
          );
          index.source = index.source.replace(
            "  </body>\n",
            '    <script src="livereload.js?port=35729"></script>\n  </body>\n'
          );
        }
      },
    },

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
