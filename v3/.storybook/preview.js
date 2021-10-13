import argo from './Argo';

export const parameters = {
    backgrounds: {
        default: 'light',
        values: [
            {
                name: 'light',
                value: '#dee6eb',
            },
            {
                name: 'dark',
                value: '#0e0e14',
            },
        ],
    },
    docs: {
        theme: argo,
    },
};
