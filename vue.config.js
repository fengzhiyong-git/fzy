const path = require('path')
const merge = require('webpack-merge')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const isDev = process.NODE_ENV === 'development'
const idProd = process.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
    // devServer: {
    //     host: "0.0.0.0",
    //     port: 8081,
    //     proxy: {
    //       // 配置跨域
    //       "/api": {
    //         target: "http://127.0.0.1:7001",
    //         ws: true,
    //         changOrigin: true,
    //         pathRewrite: {
    //           "^/api": "/"
    //         }
    //       }
    //     }
    // },
    chainWebpack: config => {
      config.plugin("define").tap(args => {
        const argv = process.argv;
        const icourt = argv[argv.indexOf("--icourt-mode") + 1];
  
        args[0]["process.env"].MODE = `"${icourt}"`;
  
        return args;
      });
  
      // svg rule loader
      const svgRule = config.module.rule("svg"); // 找到svg-loader
      svgRule.uses.clear(); // 清除已有的loader, 如果不这样做会添加在此loader之后
      svgRule.exclude.add(/node_modules/); // 正则匹配排除node_modules目录
      svgRule // 添加svg新的loader处理
        .test(/\.svg$/)
        .use("svg-sprite-loader")
        .loader("svg-sprite-loader")
        .options({
          symbolId: "icon-[name]"
        });
  
      // 修改images loader 添加svg处理
      const imagesRule = config.module.rule("images");
      imagesRule.exclude.add(resolve("src/icons"));
      config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
    },
  };
