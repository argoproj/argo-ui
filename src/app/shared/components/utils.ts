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

    shortNodeName(node: { name: string, displayName: string }): string {
        return node.displayName || node.name;
    },

    getScrollParent(el: HTMLElement): HTMLElement {
        const regex = /(auto|scroll)/;
        while (el.parentNode) {
            el = el.parentNode as HTMLElement;
            const overflow = getComputedStyle(el, null).getPropertyValue('overflow') +
            getComputedStyle(el, null).getPropertyValue('overflow-y') +
            getComputedStyle(el, null).getPropertyValue('overflow-x');
            if (regex.test(overflow)) {
                return el;
            }
        }
        return document.body;
    },

    scrollTo(element: HTMLElement, to: number, duration = 1000) {
        function easeInOutQuad(t: number, b: number, c: number, d: number) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t + b;
            }

            t--;
            return -c / 2 * ( t * ( t - 2 ) - 1) + b;
        }
        const start = element.scrollTop;
        const change = to - start;
        let currentTime = 0;
        const increment = 20;

        const animateScroll = () => {
            currentTime += increment;
            element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    },
};
