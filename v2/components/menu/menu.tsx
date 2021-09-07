import * as React from 'react';
import {ActionButtonProps} from '../action-button/action-button';
import {ThemeDiv} from '../theme-div/theme-div';

import './menu.scss';

/**
 * Wrapper component that displays a menu on click of its children.
 * Menu items can be simple strings, or use identical props to `ActionButton` to add actions to menu items
 */
export const Menu = (props: {children: React.ReactNode; items: (ActionButtonProps | string)[]}) => {
    const [menuVisible, setMenuVisible] = React.useState(false);
    const ref = React.useRef(null);

    const clickHandler = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setMenuVisible(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', clickHandler);
        return () => {
            document.removeEventListener('click', clickHandler);
        };
    });

    return (
        <div style={{position: 'relative'}}>
            <ThemeDiv className='menu' hidden={!menuVisible}>
                {(props.items || []).map((i) => {
                    let item: ActionButtonProps;
                    if (typeof i === 'string') {
                        item = {label: i};
                    } else {
                        item = i;
                    }

                    return (
                        <div
                            key={item.label}
                            className='menu__item'
                            onClick={(e) => {
                                if (item.action) {
                                    item.action();
                                }
                                e.preventDefault();
                            }}>
                            {item.icon && <i className={`fa ${item.icon}`} />}
                            <div className='menu__item__label'>{item.label}</div>
                        </div>
                    );
                })}
            </ThemeDiv>
            <div ref={ref} onClick={() => setMenuVisible(true)}>
                {props.children}
            </div>
        </div>
    );
};
