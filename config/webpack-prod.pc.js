const fs = require('fs');
const path = require('path');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AotPlugin } = require('@ngtools/webpack');

const { webpackProd, postcssPlugins, rules, plugins } = require('./webpack-prod.js');
const outputPath = "dist/pc";
const globalStyles = [path.join(process.cwd(), "src/pc/styles.scss")];

module.exports = webpackMerge(webpackProd, {
    "entry": {
        "polyfills": [
            "./src/polyfills.ts"
        ],
        "main": [
            "./src/main.pc.ts"
        ],
        "styles": [
            "./src/pc/styles.scss"
        ]
    },
    "output": {
        "filename": "[name].[chunkhash:20].bundle.js",
        "chunkFilename": "[id].[chunkhash:20].chunk.js",
        "path": path.join(process.cwd(), outputPath),
        "publicPath": "/dist/pc/"
    },
    "module": {
        "rules": [
            {
                "exclude": globalStyles,
                "test": /\.css$/,
                "use": [
                    "exports-loader?module.exports.toString()",
                    {
                        "loader": "css-loader",
                        "options": {
                            "sourceMap": false,
                            "importLoaders": 1
                        }
                    },
                    {
                        "loader": "postcss-loader",
                        "options": {
                            "ident": "postcss",
                            "plugins": postcssPlugins
                        }
                    }
                ]
            },
            {
                "exclude": globalStyles,
                "test": /\.scss$|\.sass$/,
                "use": [
                    "exports-loader?module.exports.toString()",
                    {
                        "loader": "css-loader",
                        "options": {
                            "sourceMap": false,
                            "importLoaders": 1
                        }
                    },
                    {
                        "loader": "postcss-loader",
                        "options": {
                            "ident": "postcss",
                            "plugins": postcssPlugins
                        }
                    },
                    {
                        "loader": "sass-loader",
                        "options": {
                            "sourceMap": false,
                            "precision": 8,
                            "includePaths": []
                        }
                    },
                    {
                        "loader": "sass-resources-loader",
                        "options": {
                            resources: path.join(process.cwd(), "src/pc/_variables.scss"),
                        }
                    }
                ]
            },
            {
                "include": globalStyles,
                "test": /\.css$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        {
                            "loader": "css-loader",
                            "options": {
                                "sourceMap": false,
                                "importLoaders": 1
                            }
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "postcss",
                                "plugins": postcssPlugins
                            }
                        }
                    ],
                    "publicPath": ""
                })
            },
            {
                "include": globalStyles,
                "test": /\.scss$|\.sass$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        {
                            "loader": "css-loader",
                            "options": {
                                "sourceMap": false,
                                "importLoaders": 1
                            }
                        },
                        {
                            "loader": "postcss-loader",
                            "options": {
                                "ident": "postcss",
                                "plugins": postcssPlugins
                            }
                        },
                        {
                            "loader": "sass-loader",
                            "options": {
                                "sourceMap": false,
                                "precision": 8,
                                "includePaths": []
                            }
                        },
                        {
                            "loader": "sass-resources-loader",
                            "options": {
                                resources: path.join(process.cwd(), "src/pc/_variables.scss"),
                            }
                        }
                    ],
                    "publicPath": ""
                })
            },
        ].concat(rules)
    },
    "plugins": plugins.concat([
        new AotPlugin({
            "mainPath": "main.pc.ts",
            "hostReplacementPaths": {
                "environments/environment.ts": "environments/environment-prod.pc.ts",
                "app/user/user-info.component.html": "app/user/user-info.component.pc.html",
                "app/chat/chat-editor/chat-editor.component.html": "app/chat/chat-editor/chat-editor.component.pc.html",

            },
            "exclude": [
                "**/*.spec.ts",
                "test.ts"
            ],
            "tsConfigPath": "src/tsconfig-app.pc.json",
            "sourceMap": true
        })
    ])
});
