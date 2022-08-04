import { mount } from 'enzyme';
import Fuse from 'fuse.js';
import * as React from 'react';
import {useFuzzySearch} from '../utils';

const UseFuzzySearchDemo: React.FC<{ items: string[]; search: string; options: Fuse.IFuseOptions<string> }> = ({options, items, search}) => {
    const fuzzySearch = useFuzzySearch(items, options || {});

    return (<div id='search-results'>{JSON.stringify(fuzzySearch.search(search).map((result) => result.item))}</div>);
};

const getResult = (wrapper: any): string[] => JSON.parse(wrapper.find('#search-results').text());

describe('useFuzzySearch hook test', () => {
    it('gets an explicit match', () => {
        const items = [
            'hello',
            'world',
        ];
        const wrapper = mount(<UseFuzzySearchDemo items={items} search='hello' options={{}} />);

        expect(getResult(wrapper)).toMatchObject(['hello']);

        wrapper.setProps({ search: 'world'});
        wrapper.update();

        expect(getResult(wrapper)).toMatchObject(['world']);
    });

    it('fuzzy matches', () => {
        const items = [
            'hello',
            'world',
        ];
        const wrapper = mount(<UseFuzzySearchDemo items={items} search='hlo' options={{}} />);

        expect(getResult(wrapper)).toMatchObject(['hello']);

        wrapper.setProps({ search: 'wld'});
        wrapper.update();

        expect(getResult(wrapper)).toMatchObject(['world']);
    });

    it('fuzzy matches case insensitive', () => {
        const items = [
            'hello',
            'world',
        ];
        const wrapper = mount(<UseFuzzySearchDemo items={items} search='HELLO' options={{isCaseSensitive: false}} />);

        const result = JSON.parse(wrapper.find('#search-results').text());

        expect(result).toMatchObject(['hello']);

        wrapper.setProps({ search: 'WORLD'});
        wrapper.update();

        expect(getResult(wrapper)).toMatchObject(['world']);
    });
});
