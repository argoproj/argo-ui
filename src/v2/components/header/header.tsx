import * as React from 'react';

import './header.scss';

export const Logo = () => <img src='assets/images/argo-icon-color-square.png' style={{width: '35px', height: '35px', margin: '0 8px'}} alt='Argo Logo' />;

export const Brand = (props: {path?: string; welcomeText?: string; brandName?: string}) => {
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

export const Header = (props: {children: React.ReactNode; style?: React.CSSProperties}) => {
    return (
        <header className='header' style={props.style}>
            {props.children}
        </header>
    );
};
