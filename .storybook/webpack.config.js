const CopyWebpackPlugin = require('copy-webpack-plugin');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
    const config = genDefaultConfig(baseConfig, env);

    config.module.rules = [{
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader?configFileName=./stories/tsconfig.json'
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
        from: 'node_modules/node_modules/@fortawesome/fontawesome-free/webfonts', to: 'assets/fonts'
    }]));

    return config;
};
