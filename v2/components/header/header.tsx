import * as React from 'react';

import './header.scss';

export const Logo = () => <img src='/argo-icon-color-square.png' style={{width: '35px', height: '35px', margin: '0 8px'}} alt='Argo Logo' />;

interface BrandProps {
    path?: string;
    welcomeText?: string;
    brandName?: string;
    logo?: React.ReactNode;
}
/**
 * Brand Hero designed for display in a header. Includes the Argo Logo and a welcome message that fades after page load
 */
export const Brand = (props: BrandProps) => {
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    }, [props.welcomeText]);

    const showWelcome = loading && !props.path;
    const welcomeText = props.welcomeText || 'Welcome to';
    return (
        <div className='header__brand'>
            {props.logo ? props.logo : <Logo />}
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

/**
 * Header banner in dark indigo color, designed for display at the top of a page. Wraps its children in indigo banner.
 */
export const Header = (props: HeaderProps) => {
    return (
        <header className='header' style={props.style as any}>
            {props.children}
        </header>
    );
};
