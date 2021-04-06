import * as React from 'react';
import {Alert} from '../components';
import * as Components from '../components';
import {AlertType} from '../components/alert/alert';
import * as babel from '@babel/standalone';
import Editor from '../components/code-editor/code-editor';
import * as lzString from 'lz-string';
import {createBrowserHistory} from 'history';
const history = createBrowserHistory();

import './Explorer.scss';

const CODE_PARAM_KEY = 'codeHash';

const scopeEval = (source: string, scope: any) => {
    const keys = [];
    const values = [];
    for (const key in scope) {
        if (!{}.hasOwnProperty.call(scope, key)) continue;
        const value = scope[key];
        if (key === 'this') {
            continue;
        }
        keys.push(key);
        values.push(value);
    }
    return Function(...keys, `return eval(${JSON.stringify(source)})`).apply(scope.this, values);
};

const compileJsx = (code: string) => babel.transform(`<React.Fragment>${code.trim() || ''}</React.Fragment>`, {presets: ['react']}).code;

class CatchErrors extends React.Component<{code: string}> {
    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const {code} = this.props;
        this.setState({invalidCode: code, error, info});
    }

    state: {
        error: Error;
        invalidCode: string;
        info: React.ErrorInfo;
    } = {
        error: null,
        invalidCode: null,
        info: null,
    };

    render() {
        const {invalidCode, error, info} = this.state;
        const {code, children} = this.props;

        if (code !== invalidCode || !info) {
            return children;
        }

        const componentStack = info.componentStack
            .split('\n')
            .filter((line: string) => /RenderCode/.test(line))
            .map((line: string) => line.replace(/ \(created by .*/g, ''));

        const lines = componentStack.slice(0, componentStack.length - 1);

        return (
            <div>
                <Alert type={AlertType.Error}>{error.message}</Alert>
                {lines.map((line: string, i: number) => (
                    <span key={i}>{line}</span>
                ))}
            </div>
        );
    }
}

const Explorer = () => {
    const [compiled, setCompiled] = React.useState(null);
    const [error, setError] = React.useState(null);
    const params = new URLSearchParams(window.location.search);
    const decompressed = lzString.decompressFromEncodedURIComponent(params.get(CODE_PARAM_KEY) || '');
    const [code, setCode] = React.useState(decompressed || '');

    React.useEffect(() => {
        if (code) {
            const compressed = lzString.compressToEncodedURIComponent(code);
            params.set(CODE_PARAM_KEY, compressed);
            history.push({search: '?' + params.toString()});
        }
    }, [code]);

    React.useEffect(() => {
        try {
            setCompiled(compileJsx(code));
            setError(null);
        } catch (e) {
            setError((e.message as string) || null);
        }
    }, [code]);

    return (
        <React.Fragment>
            <div className='sandbox'>
                <CatchErrors code={compiled}>{scopeEval(compiled, {React, ...Components})}</CatchErrors>
            </div>
            <div style={{margin: '0 10px'}}>
                {error && <Alert type={AlertType.Error}>{error}</Alert>}
                <div style={{height: '20em', marginTop: '1em'}}>
                    <Editor setCode={setCode} init={code} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Explorer;
