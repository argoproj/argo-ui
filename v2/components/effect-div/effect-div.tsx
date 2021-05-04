import * as React from 'react';
import {DocumentedComponent} from '../../types/documentation';
import {appendSuffixToClasses} from '../../utils/utils';
import ThemeDiv from '../theme-div/theme-div';

import './effect-div.scss';

interface EffectDivProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: React.ReactNode;
    innerref?: React.MutableRefObject<any>;
}

export class EffectDiv extends DocumentedComponent<EffectDivProps> {
    static docs = {
        name: 'EffectDiv',
        description: `
EffectDiv is a component that attaches a background a div, that can be animated with CSS transitions or otherwise.
It was designed to avoid text artifacts when scaling a div; an EffectDiv allows you to easily scale JUST its background, and not its contents.

You can drop in replace a div with an EffectDiv, but to add a background effect, you need to:
- Remove background styles from the main div (including border and border-radius)
- Add the styles you removed to the &__background element
- Add transitions to the &__background element
        `,

        props: [{name: 'innerref', type: 'React.MutableRefObject<any>', description: 'A ref that is passed to the div contained within EffectDiv'}],
    };
    render = () => <_EffectDiv {...this.props} />;
}

export const _EffectDiv = (props: EffectDivProps) => {
    const backgroundCl = appendSuffixToClasses(props.className, '__background');
    return (
        <ThemeDiv className={`${props.className} effect-div`} style={props.style} onClick={props.onClick} innerref={props.innerref}>
            <ThemeDiv className={`effect-div__background ${backgroundCl}`} />
            <div style={{zIndex: 2, position: 'relative', display: 'inherit', flex: 'inherit', alignItems: 'inherit'}}>{props.children}</div>
        </ThemeDiv>
    );
};
