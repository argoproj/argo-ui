import {shallow} from 'enzyme';
import * as React from 'react';
import {DataLoader} from './data-loader';

describe('DataLoader', () => {
    it('should support excluding the input from parameters', async () => {
        const promise = Promise.resolve('foo');

        const dataLoader = shallow(
            <DataLoader load={() => promise}>
            {(result) => (
                <p>{result}</p>
            )}
            </DataLoader>,
        );

        await promise;

        // Wait one additional tick of the event loop to ensure that the data loader
        // component has has an opportunity to render
        await new Promise((resolve) => setImmediate(resolve));

        expect(dataLoader.find('p').text()).toBe('foo');
    });

    it('should require the load fn to accept an argument if input is provided', async () => {
        const promise = Promise.resolve('foo');
        const loadFn = jest.fn<Promise<string>, [string]>().mockReturnValue(promise);

        const dataLoader = shallow(
            <DataLoader load={loadFn} input='bar'>
            {(result) => (
                <p>{result}</p>
            )}
            </DataLoader>,
        );

        await promise;

        // Wait one additional tick of the event loop to ensure that the data loader
        // component has has an opportunity to render
        await new Promise((resolve) => setImmediate(resolve));

        expect(loadFn).toHaveBeenCalledWith('bar');
        expect(dataLoader.find('p').text()).toBe('foo');
    });

    it('should not require the loadFn to accept the input is provided', async () => {
        const promise = Promise.resolve('foo');

        const dataLoader = shallow(
            <DataLoader load={() => promise} input='bar'>
            {(result) => (
                <p>{result}</p>
            )}
            </DataLoader>,
        );

        await promise;

        // Wait one additional tick of the event loop to ensure that the data loader
        // component has has an opportunity to render
        await new Promise((resolve) => setImmediate(resolve));

        expect(dataLoader.find('p').text()).toBe('foo');
    });
});
