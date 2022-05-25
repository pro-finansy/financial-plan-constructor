const path = require("path");

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src')
      },
      extensions: ['.js', '.vue', '.json']
    }
  },
  outputDir: path.resolve(__dirname, '../server/dist/public'),
  devServer: {
    proxy: process.env.VUE_APP_PROD_HOST
  }
};