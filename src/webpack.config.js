'use strict;';

const config = require('../app/webpack.config');
const webpack = require('webpack');

module.exports = Object.assign({}, config, {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/../../bundle',
        library: 'argo-ui',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            SYSTEM_INFO: JSON.stringify({
                version: process.env.ARGO_VERSION || 'latest',
            }),
        }),
    ],
});
