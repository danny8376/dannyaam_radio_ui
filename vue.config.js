//const WebpackCdnPlugin = require("webpack-cdn-plugin");

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
      externals: {},
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
  devServer: {
    public: "10.250.150.95:8080"
  },
  transpileDependencies: [/node_modules[/\\\\]vuetify[/\\\\]/],
  publicPath: "./"
};
