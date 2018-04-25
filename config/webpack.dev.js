const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackCommon = require('./webpack.common.js');
const helper = require('./helper');
const path = require('path');

const proxy = require('http-proxy-middleware');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const express = require("express");

module.exports = webpackMerge(webpackCommon, {
    output    : {
        path      : helper.root('dist'),
        // publicPath: helper.root('dist'),
        publicPath : '/',
        filename  : '[name].js'
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
                // target: 'http://103.27.179.79:8102/',
                target: 'http://www.099609.com/',
                // target: 'http://www.399432.com/',
                // target: 'http://127.0.0.1:8102/',
                // target: 'http://103.27.179.80/',
                changeOrigin: true,
                pathRewrite: {
                    '^/im': '/im'
                    // '^/im': '/im/1000'
                },
                ws: true
            }));

            app.use('/', proxy(function(pathname) {
                return pathname.startsWith('/external');
            }, {
                target: 'http://www.099609.com/',
                // target: 'http://www.399432.com/',
                // target: 'https://www.cp9877.com/',
                // target: 'http://127.0.0.1:8101/',
                changeOrigin: true,
                pathRewrite: {
                    // '^/external': '/'
                    // '^/proxy': '/im/1000'
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
                target: 'http://www.099609.com/',
                // target: 'http://www.399432.com/',
                // target: 'http://127.0.0.1:8101/',
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy': '/',
                    // '^/proxy': '/im/1000',
                    // '^/session': '/im/1000/session'
                },
            }));

            //静态资源 && browser-sync
            app.use(
                express.static('C:/Users/hzjio/Documents/projectSourceCode/zhangrc/Hallo/chat/chat-help-web')
                // express.static('/Users/zhangrc/git/projects/chat/chat-help-web/')
                // express.static('C:/Users/30594/Desktop/project/chat-help-web/')
            );

        }
    }
});