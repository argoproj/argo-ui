const path = require('path');

module.exports = ({config}) => {
    config.module.rules = [{
        test: /\.less$/,
        use: [{
            loader: 'style-loader',
        }, {
            loader: 'css-loader', // translates CSS into CommonJS
        }, {
            loader: 'less-loader', // compiles Less to CSS
        }]
    }];
    return config;
};
