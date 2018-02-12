import { NODE_PHASE } from '../../../models';

export const Utils = {
    statusIconClasses(status: string): string {
        let classes = [];
        switch (status) {
            case NODE_PHASE.ERROR:
            case NODE_PHASE.FAILED:
                classes = ['fa-times-circle', 'status-icon--failed'];
                break;
            case NODE_PHASE.SUCCEEDED:
                classes = ['fa-check-circle', 'status-icon--success'];
                break;
            case NODE_PHASE.RUNNING:
                classes = ['fa-circle-o-notch', 'status-icon--running', 'status-icon--spin'];
                break;
            default:
                classes = ['fa-clock-o', 'status-icon--init'];
                break;
        }
        return classes.join(' ');
    },

    shortNodeName(name: string): string {
        let nameStart = name.length;
        let escaped = 0;
        while (nameStart-- > 0) {
            const next = name[nameStart];
            if (next === ')') {
                escaped++;
            } else if (next === '(') {
                escaped--;
            }
            if (!escaped && next === '.') {
                nameStart++;
                break;
            }
        }
        return name.substring(nameStart);
    },
};
