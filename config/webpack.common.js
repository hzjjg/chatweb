const webpack = require('webpack');
const helper = require('./helper');
const proxy = require('http-proxy-middleware');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');


//to-string-loader用style-loader 替代
const config = {

    // entry: {
    //     'polyfills': './src/polyfills.ts', // 运行Angular时所需的一些标准js
    //     'vendor': './src/vendor.ts', // Angular、Lodash、bootstrap.css......
    //     'app': './src/main.pc.ts',
    //     'styles': './src/pc/styles.scss'
    // },
    resolve: { // 解析模块路径时的配置
        extensions: ['.ts', '.js'] // 制定模块的后缀，在引入模块时就会自动补全
    },
    module: {
        rules: [ //规则 不同类型 所需使用什么加载器来处理

            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
                //awesome-typescript-loader - 一个用于把TypeScript代码转译成ES5的加载器，它会由tsconfig.json文件提供指导
                //angular2-template-loader - 用于加载Angular组件的模板和样式
            }, {
                test: /\.json$/,
                use : ['json-loader']
            }, {
                test: /\.styl$/,
                loader: 'css-loader!stylus-loader' //用途？？？
            }, {
                test: /\.css$/,
                loaders: ['to-string-loader', 'css-loader']
            },

            {
                test: /\.html$/,
                use: 'raw-loader',
                exclude: [helper.root('src/index.html')]
                //html - 为组件模板准备的加载器
            }, {
                test:/\.(jpg|png|gif)$/,
                use:"file-loader"
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use : "url-loader?limit=10000&minetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use : "file-loader"
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

    ],
};
module.exports = config;