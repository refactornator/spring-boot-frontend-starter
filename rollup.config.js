import path from "path";
import svelte from "rollup-plugin-svelte";
import html from "@rollup/plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import del from "rollup-plugin-delete";
import livereload from "rollup-plugin-livereload";
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
    entryFileNames: production ? "[name].[hash].js" : "[name].js",
  },
  plugins: [
    del({ targets: staticDir }),
    svelte({
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("bundle.css");
      },
    }),

    postcss({
      extract: true,
      sourceMap: true,
      minimize: production,
    }),

    html({
      title: "My App",
    }),

    !production && livereload(staticDir),

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
