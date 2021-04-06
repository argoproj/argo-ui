'use strict;';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
        main: './src/v2/explorer/index.tsx',
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: __dirname + '/../../dist/explorer',
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.ttf'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [`ts-loader?allowTsInNodeModules=true&configFile=${path.resolve('./src/v2/explorer/tsconfig.json')}`],
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!raw-loader!sass-loader',
            },
            {
                test: /\.css$/,
                loader: 'style-loader!raw-loader',
            },
            {
                test: /\.ttf$/,
                use: ['file-loader'],
            },
        ],
    },
    node: {
        fs: 'empty',
    },
    plugins: [
        new webpack.DefinePlugin({
            SYSTEM_INFO: JSON.stringify({
                version: process.env.VERSION || 'latest',
            }),
        }),
        new HtmlWebpackPlugin({template: 'src/v2/explorer/index.html'}),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/assets', to: 'assets'},
                {
                    from: 'node_modules/@fortawesome/fontawesome-free/webfonts',
                    to: 'assets/fonts',
                },
            ],
        }),
    ],
    mode: 'development',

    devServer: {
        host: 'localhost',
        port: 3200,
        historyApiFallback: {
            disableDotRule: true,
        },
        watchOptions: {
            ignored: [/dist/, /node_modules/],
        },
        headers: {
            'X-Frame-Options': 'SAMEORIGIN',
        },
    },
};

module.exports = config;
