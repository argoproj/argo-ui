const path = require('path');

module.exports = {
    stories: ['../stories/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
    typescript: {
        check: false, // typecheck separately
        reactDocgen: false, // substantially improves performance: https://github.com/storybookjs/storybook/issues/22164#issuecomment-1603627308
    },
    webpackFinal: async (config, {configType}) => {
        config.devtool = false; // perf per: https://github.com/storybookjs/storybook/issues/19736#issuecomment-1478103817
        config.module.rules.push({
            test: /\.scss$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, '../'),
            sideEffects: true, // get side-effect styles to load per: https://github.com/storybookjs/storybook/issues/4690#issuecomment-435909433
            loader: 'style-loader!raw-loader!sass-loader'
        });
        return config;
    },
};
