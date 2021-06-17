const path = require('path');

module.exports = {
    stories: ['../components/**/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
    webpackFinal: async (config, {configType}) => {
        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: path.resolve(__dirname, '../'),
        });
        return config;
    },
    managerHead: (head) => `
        ${head}
        <link rel="icon" href="/argo-favicon.png" />
    `,
};
