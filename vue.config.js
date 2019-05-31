const fs = require("fs");
const path = require("path");
//const WebpackCdnPlugin = require("webpack-cdn-plugin");

const externalLibs = {};
const externalConf = {};

((npms, ghs) => {
  let json;
  try {
    const jsonStr = fs.readFileSync(
      path.join(process.cwd(), "./package-lock.json"),
      "utf8"
    );
    json = JSON.parse(jsonStr).dependencies;
  } catch (e) {
    json = [];
  }
  function resolveDev(n, f) {
    if (f === true) {
      const fp = `node_modules/${n}`;
      try {
        const jsonStr = fs.readFileSync(
          path.join(process.cwd(), fp, "./package.json"),
          "utf8"
        );
        return path.join(fp, JSON.parse(jsonStr).main);
      } catch (e) {
        return [];
      }
    }
    if (typeof f === "string") return [`node_modules/${n}/${f}`];
    if (typeof f === "object")
      return f.map(fc => {
        return `node_modules/${n}/${fc}`;
      });
    return [];
  }
  function resolveCdn(n, v, f, t) {
    t = t || "npm";
    if (f === true) return [`//cdn.jsdelivr.net/${t}/${n}@${v}`];
    if (typeof f === "string")
      return [`//cdn.jsdelivr.net/${t}/${n}@${v}/${f}`];
    if (typeof f === "object")
      return f.map(fc => {
        return `//cdn.jsdelivr.net/${t}/${n}@${v}/${fc}`;
      });
    return [];
  }
  if (process.env.NODE_ENV === "production") {
    npms.forEach(lib => {
      const { name, v, js, css, setenv } = lib;
      externalConf[name] = v;
      externalLibs[name] = {};
      externalLibs[name].js = resolveCdn(name, json[name].version, js);
      externalLibs[name].css = resolveCdn(name, json[name].version, css);
      if (setenv)
        setenv(f => {
          return resolveCdn(name, json[name].version, f);
        });
    });
  } else {
    npms.forEach(lib => {
      const { name, setenv } = lib;
      if (setenv)
        setenv(f => {
          return resolveDev(name, json[name].version, f);
        });
    });
  }
  ghs.forEach(lib => {
    const { name, v, ver, js, css, setenv } = lib;
    if (v) externalConf[name] = v;
    externalLibs[name] = {};
    externalLibs[name].js = resolveCdn(name, ver, js, "gh");
    externalLibs[name].css = resolveCdn(name, ver, css, "gh");
    if (setenv)
      setenv(f => {
        return resolveCdn(name, ver, f, "gh");
      });
  });
})(
  [
    // NPM
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
    },
    {
      name: "audio5",
      v: "Audio5js",
      js: true,
      setenv(resolveFile) {
        process.env.VUE_APP_AUDIO5_FLASH = resolveFile("swf/audio5js.swf");
      }
    }
  ],
  [
    // GitHub
    /*
  {
    name: "f5io/fifer-js",
    v: "Fifer",
    ver: "9111164814e3d4ed9ae950cb8e6f89e743744873",
    js: "dist/fifer.min.js",
    setenv(resolveFile) {
      process.env.VUE_APP_FIFER_FLASH = resolveFile("lib/fifer.fallback.swf");
    }
  }
 */
  ]
);

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
      externals: [externalConf],
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
    config.plugin("html").tap(args => {
      const libTags = [];
      for (const lib in externalLibs) {
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
