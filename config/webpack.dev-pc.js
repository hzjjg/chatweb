const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackDev = require('./webpack.dev.js');
const webpack = require('webpack');
const helper = require('./helper');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AotPlugin } = require('@ngtools/webpack')


module.exports = webpackMerge(webpackDev, {
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

});