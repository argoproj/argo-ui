'use strict;';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = {
    entry: './src/app/index.tsx',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/../../dist/app'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader?configFileName=./src/app/tsconfig.json'
            }, {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'style-loader!raw-loader!sass-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/app/index.html' }),
        new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets'}]),
    ],
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': {
                'target': process.env.ARGO_API_URL || 'http://localhost:8001',
                'secure': false,
            }
        }
    }
};

if (process.env.NODE_ENV === 'production') {
    config
        .plugins
        .push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
