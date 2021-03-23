const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    output : {
        filename: './dist/bundle.js'
    },
    resolve: {
       symlinks: false,
       alias: {
        AutoNumeric: 'autonumeric/dist/autoNumeric.min',
      },
    },
    plugins: [
      // new BundleAnalyzerPlugin()
    ],
  },
  outputDir: process.env.NODE_ENV === 'production'
    ? 'release-accounting-vue-admin/'
    : 'dev-accounting-vue-admin/',
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue'
  ],
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
 
    svgRule.uses.clear();
 
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
}
