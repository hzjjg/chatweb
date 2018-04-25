const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackCommon = require('./webpack.common.js');
const proxy = require('http-proxy-middleware');

const helper = require('./helper');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { AotPlugin } = require('@ngtools/webpack');

module.exports = webpackMerge(webpackCommon, {
    output    : {
        path      : helper.root('dist'),
        publicPath: '/',
        filename  : '[name].js'
    },
    entry: {
        main: [
            "./src/main.pc.ts"
        ],
        polyfills: [
            "./src/polyfills.ts"
        ],
        styles: [
            "./src/pc/styles.scss"
        ]
    },
    module: {
        rules: [
            {
                //@angular/cli/models/webpack-configs/styles.js
                // include: [helper.root('/src/rui/css/app.scss')],
                include: [helper.root('./src/pc/styles.scss')],
                // test: /\.scss/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }
                ])
            },
            {
                test: /\.scss$/, // 自行配置测试.ing
                exclude: [helper.root('./src/pc/styles.scss')],
                // include: [helper.root('./src/app')],
                use: [{
                    loader: 'to-string-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }, {
                    "loader": "sass-resources-loader",
                    "options": {
                        resources: path.join(process.cwd(), "src/pc/_variables.scss"),
                    }
                }]

                // 为了处理scss中的 url() 引用的图像文件，还得使用 url-loader
                // http://www.jianshu.com/p/8d16e82a53f3
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
            //多个html共用一个js文件，提取公共代码
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //热替换
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({ filename: '[name].bundle.css' }),
        new AotPlugin({
            "mainPath": "main.pc.ts",
            "replaceExport": false,
            "hostReplacementPaths": {
                "environments/environment.ts": "environments/environment-dev.pc.ts",
                "app/user/user-info.component.html": "app/user/user-info.component.pc.html",
                "app/chat/chat-editor/chat-editor.component.html": "app/chat/chat-editor/chat-editor.component.pc.html",
                // "app/contact/contact-list.component.html": "app/contact/contact-list.component.pc.html"
            },
            "exclude": [],
            "tsConfigPath": "src/tsconfig-app.pc.json",
            "skipCodeGeneration": true
        })
    ],
    devServer : {
        port              : 8070,
        historyApiFallback: true,
        disableHostCheck: true,
        /**
         * Here you can access the Express app object and add your own custom middleware to it.
         *
         * See: https://webpack.github.io/docs/webpack-dev-server.html
         */
        setup: function(app) {
            app.use('/', proxy(function(pathname) {
                //可能根据request判断更为合理
                return new RegExp("^/im$").test(pathname);
            }, {
                // target:
                target: 'http://127.0.0.1:8102/',
                // target: 'http://www.099609.com/',
                // target: 'http://103.27.179.80/',
                changeOrigin: true,
                pathRewrite: {
                    '^/im': '/im/1000'
                },
                ws: true
            }));

            app.use('/', proxy(function(pathname) {
                return pathname.startsWith('/external');
            }, {
                target: 'https://www.cp9877.com/',
                // target: 'http://127.0.0.1:8101/',
                changeOrigin: true,
                pathRewrite: {
                    '^/external': '/'
                    // '^/proxy': y'/im/1000'
                },
            }));

            app.use('/', proxy( function (pathname, req) {
                if (pathname.startsWith('/images')) {
                    return false;
                }
                return [
                    "/proxy",
                    "/session",
                    "/captcha.jpg"
                ].some(function (path) {
                    return pathname.startsWith(path);
                });
            }, {
                // target: 'http://103.27.179.79:8101/',
                // target: 'http://103.27.179.80/',
                target: 'http://127.0.0.1:8101/',
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy': '/im/1000',
                    '^/session': '/im/1000/session'
                },
            }));

        }
    }
});