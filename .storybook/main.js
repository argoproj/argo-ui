const path = require('path');

module.exports = {
    stories: ['../stories/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
    webpackFinal: async (config, {configType}) => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader'
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: 'style-loader!raw-loader!sass-loader'
        });
        return config;
    },
};
