import * as React from 'react';

import { Page } from '../../shared/components';

require('./help.scss');

export const Help = () => (
    <Page title='Help'>
        <div className='row'>
            <div className='columns large-4 medium-12'>
                <div className='help-box'>
                    <div className='help-box__ico help-box__ico--manual'/>
                    <h3>Documentation</h3>
                    <a href='http://www.argoproj.io/' target='_blank' className='help-box__link'> Argo Project</a>
                </div>
            </div>
            <div className='columns large-4 medium-12'>
                <div className='help-box'>
                    <div className='help-box__ico help-box__ico--email'/>
                    <h3>Contact</h3>
                    <a className='help-box__link' href='https://groups.google.com/forum/#!forum/argo-project'>Argo Community</a>
                    <a className='help-box__link' href='mailto:support@applatix.com'>support@applatix.com</a>
                </div>
            </div>
            <div className='columns large-4 medium-12'>
                <div className='help-box'>
                    <div className='help-box__ico help-box__ico--download'/>
                    <h3>Argo CLI</h3>
                    <div className='row text-left help-box__download'>
                        <div className='columns small-6'>
                            <a href='https://github.com/argoproj/argo/releases/download/v2.0.0-beta1/argo-linux-amd64'><i
                                    className='fa fa-linux' aria-hidden='true'/> Linux
                            </a>
                        </div>
                        <div className='columns small-6'>
                            <a href='https://github.com/argoproj/argo/releases/download/v2.0.0-beta1/argo-darwin-amd64'><i
                                    className='fa fa-apple' aria-hidden='true'/> macOS
                            </a><br/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Page>
);
