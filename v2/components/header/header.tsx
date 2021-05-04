import * as React from 'react';
import {DocumentedComponent} from '../../types/documentation';

import './header.scss';

export const Logo = () => <img src='assets/images/argo-icon-color-square.png' style={{width: '35px', height: '35px', margin: '0 8px'}} alt='Argo Logo' />;

interface BrandProps {
    path?: string;
    welcomeText?: string;
    brandName?: string;
}
export class Brand extends DocumentedComponent<BrandProps> {
    static docs = {
        name: 'Brand',
        description: 'Brand Hero designed for display in a header. Includes the Argo Logo.',
        props: [
            {
                name: 'path',
                type: 'string',
                description: 'Path string that is displayed as orange text after brandName text. E.g. Argo Rollouts / rollout-demo , where rollout-demo is the path',
                default: 'Argo',
            },
            {name: 'welcomeText', type: 'string', description: 'Text that is shown to the left of brandName for a brief period (500ms), before fading', default: 'Welcome to'},
            {name: 'brandName', type: 'string', description: 'Main hero text'},
        ],
    };
    render = () => <_Brand {...this.props} />;
}
export const _Brand = (props: BrandProps) => {
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    const showWelcome = loading && !props.path;
    const welcomeText = props.welcomeText || 'Welcome to';
    return (
        <div className='header__brand'>
            <Logo />
            <h1>
                <div className='header__welcome' style={{opacity: showWelcome ? 1 : 0, transform: showWelcome ? 'none' : 'scaleX(0.01)', width: `${welcomeText.length}ch`}}>
                    {welcomeText}
                </div>
                <div className='header__title' style={showWelcome ? {transform: `translateX(${welcomeText.length}ch)`} : {transform: 'translateX(0)'}}>
                    {props.brandName || 'Argo'} {props.path && <h2> / {props.path} </h2>}
                </div>
            </h1>
        </div>
    );
};

interface HeaderProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export class Header extends DocumentedComponent<HeaderProps> {
    static docs = {
        name: 'Header',
        description: 'Header banner in dark indigo color, designed for display at the top of a page. Wraps its children in indigo banner.',
    };
    render = () => <_Header {...this.props} />;
}

export const _Header = (props: HeaderProps) => {
    return (
        <header className='header' style={props.style as any}>
            {props.children}
        </header>
    );
};
