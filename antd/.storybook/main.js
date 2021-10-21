const path = require('path');

module.exports = {
    stories: ['../components/**/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
    webpackFinal: async (config, {configType}) => {
        config.module.rules.push({
            test: /\.less$/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
            }, {
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        javascriptEnabled: true
                    }
                }
            }]
        });
        return config;
    },
    managerHead: (head) => `
        ${head}
        <link rel="icon" href="/argo-favicon.png" />
    `,
};
