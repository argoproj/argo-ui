import classNames from 'classnames';
import * as React from 'react';
import {RenderSuggestionParams} from 'react-autosuggest';
import * as ReactAutosuggest from 'react-autosuggest';

export interface AutosuggestProps {
    allSuggestions: string[];
    value: string;
}

export class Autosuggest extends React.Component<AutosuggestProps> {

    public render() {
        return (
            <ReactAutosuggest
                suggestions={this.getSuggestions()}
                getSuggestionValue={(s) => s}
                inputProps={{
                    value: this.props.value,
                    onChange: (_: React.FormEvent<any>, params: ReactAutosuggest.ChangeEvent) => {
                        this.setState({value: params.newValue});
                    },
                }}
                onSuggestionsFetchRequested={this.getSuggestions}
                renderSuggestion={(
                    suggestion: string,
                    params: RenderSuggestionParams,
                ) => (
                    <div className={classNames('select__option', {selected: params.isHighlighted})} key={suggestion}>
                        {suggestion}
                    </div>
                )}
                renderInputComponent={(inputProps) => (
                    <div>
                        <input {...inputProps} className={'argo-field'} />
                    </div>
                )}
            />
        );
    }

    private getSuggestions(): string[] {
        return this.props.allSuggestions.filter((s) => s.includes(this.props.value));
    }
}
