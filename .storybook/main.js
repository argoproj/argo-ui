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
            include: path.resolve(__dirname, '../'),
            sideEffects: true, // get side-effect styles to load per: https://github.com/storybookjs/storybook/issues/4690#issuecomment-435909433
            loader: 'style-loader!raw-loader!sass-loader'
        });
        return config;
    },
};
