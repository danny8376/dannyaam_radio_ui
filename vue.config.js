const fs = require("fs");
const path = require("path");
//const WebpackCdnPlugin = require("webpack-cdn-plugin");

const externalLibs = {};
const externalConf = {};

((npms, ghs) => {
  let json;
  try {
    jsonStr = fs.readFileSync(path.join(process.cwd(), "./package-lock.json"), "utf8");
    json = JSON.parse(jsonStr).dependencies;
  } catch (e) {
    json = [];
  }
  if (process.env.NODE_ENV === "production") {
    function resolveFile(n, v, f, t) {
      t = t || "npm";
      if (f === true) return [`//cdn.jsdelivr.net/${t}/${n}@${v}`];
      if (typeof f === 'string') return [`//cdn.jsdelivr.net/${t}/${n}@${v}/${f}`];
      if (typeof f === 'object') return f.map(fc => { return `//cdn.jsdelivr.net/${t}/${n}@${v}/${fc}` });
      return [];
    }
    npms.forEach(lib => {
      const {name, v, js, css} = lib;
      externalConf[name] = v;
      externalLibs[name] = {};
      externalLibs[name].js = resolveFile(name, json[name].version, js);
      externalLibs[name].css = resolveFile(name, json[name].version, css);
    });
    ghs.forEach(lib => {
      const {name, v, ver, js, css} = lib;
      if (v) externalConf[name] = v;
      externalLibs[name] = {};
      externalLibs[name].js = resolveFile(name, json[name].version, js, "gh");
      externalLibs[name].css = resolveFile(name, json[name].version, css, "gh");
    });
  }
})([ // NPM
  {
    name: "vue",
    v: "Vue",
    js: "dist/vue.runtime.min.js"
  },
  {
    name: "vue-resource",
    v: "VueResource",
    js: true
  },
  {
    name: "vuetify",
    v: "Vuetify",
    js: true,
    css: "dist/vuetify.min.css"
  }
],[ // GitHub
]);

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer.forEach(minimizer => {
        if (minimizer.options && minimizer.options.terserOptions) {
          const options = minimizer.options.terserOptions;
          options.ie8 = true;
        }
      });
    }
    return {
      externals: [
        externalConf
      ],
      plugins: [
        /* since it's always empty publicPath which breaks my deployment, remove it until fixed
        new WebpackCdnPlugin({
          modules: [
            {
              name: "vue"
            },
            {
              name: "vuetify"
            }
          ],
          prod: process.env.NODE_ENV === "production",
          prodUrl: "//cdn.jsdelivr.net/npm/:name@:version/:path"
        })
        // */
      ]
    };
  },
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        const libTags = [];
        for(const lib in externalLibs) {
          externalLibs[lib].js.forEach(f => {
            libTags.push(`<script src="${f}"></script>`);
          });
          externalLibs[lib].css.forEach(f => {
            libTags.push(`<link href="${f}" rel=stylesheet>`);
          });
        }
        args[0].EXTERNAL = libTags.join("");
        return args;
      });
  },
  devServer: {
    public: "10.250.150.95:8080"
  },
  transpileDependencies: [/node_modules[/\\\\]vuetify[/\\\\]/],
  publicPath: "./"
};
