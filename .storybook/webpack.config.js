const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({config}) => {
    config.module.rules = [{
        test: /\.(ts|tsx)$/,
        loader: `ts-loader?configFile=${path.resolve('./stories/tsconfig.json')}`
    }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: 'style-loader!raw-loader!sass-loader'
    }, {
        test: /\.css$/,
        loader: 'style-loader!raw-loader'
    }];
    config.resolve = {
        extensions: ['.ts', '.tsx', '.js', '.json']
    };
    config.plugins.push(new CopyWebpackPlugin([{
        from: 'src/assets', to: 'assets'
    }, {
        from: 'node_modules/@fortawesome/fontawesome-free/webfonts', to: 'assets/fonts'
    }]));

    return config;
};
