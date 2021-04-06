import * as React from 'react';
import ThemeDiv from '../theme-div/theme-div';
import {Controlled as ReactCodeMirror} from 'react-codemirror2';
import {Editor as CMEditor, EditorConfiguration} from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import './code-editor.scss';

export const Editor = (props: {setCode: (code: string) => void; init?: string}) => {
    const [code, setCode] = React.useState(props.init || '');
    const editorRef = React.useRef<CMEditor | null>(null);

    return (
        <ThemeDiv className='code-editor'>
            <ReactCodeMirror
                className='code-editor--editor'
                editorDidMount={(editorInstance) => {
                    editorRef.current = editorInstance;
                }}
                onBeforeChange={(editorInstance, data, newCode) => {
                    if (editorInstance.hasFocus()) {
                        setCode(newCode);
                        props.setCode(newCode);
                    }
                }}
                options={
                    {
                        mode: 'jsx',
                        autoCloseTags: true,
                        autoCloseBrackets: true,
                        theme: 'neo',
                        viewportMargin: 50,
                        lineNumbers: true,
                        extraKeys: {
                            Tab: (cm: any) => {
                                if (cm.somethingSelected()) {
                                    cm.indentSelection('add');
                                } else {
                                    const indent = cm.getOption('indentUnit') as number;
                                    const spaces = Array(indent + 1).join(' ');
                                    cm.replaceSelection(spaces);
                                }
                            },
                        },
                    } as EditorConfiguration
                }
                value={code}
            />
        </ThemeDiv>
    );
};

export default Editor;
