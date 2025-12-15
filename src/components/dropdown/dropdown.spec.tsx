import {act} from 'react-dom/test-utils';
import {mount, ReactWrapper} from 'enzyme';
import * as React from 'react';

import {DropDown} from './dropdown';

describe('DropDown', () => {
    let wrapper: ReactWrapper | null;

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = null;
        }
    });

    const renderDropdown = (onSelect: () => void) => mount(
        <DropDown anchor={() => <button id='anchor'>anchor</button>} isMenu={true}>
            <ul>
                <li onClick={onSelect}>first</li>
                <li>second</li>
            </ul>
        </DropDown>,
    );

    it('selects the first item when pressing Enter inside an open dropdown', async () => {
        const onSelect = jest.fn();
        wrapper = renderDropdown(onSelect);

        await act(async () => {
            wrapper!.find('.argo-dropdown__anchor').simulate('click', {stopPropagation: () => {}});
            await Promise.resolve();
        });
        wrapper.update();

        const preventDefault = jest.fn();
        const event: any = {key: 'Enter', target: wrapper.find('.argo-dropdown__anchor').getDOMNode(), preventDefault};

        (wrapper.instance() as any).selectTopResult(event);

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(preventDefault).toHaveBeenCalled();
    });

    it('ignores Enter when the dropdown is closed or when the target is outside', async () => {
        const onSelect = jest.fn();
        wrapper = renderDropdown(onSelect);

        const closedEvent: any = {key: 'Enter', target: wrapper.find('.argo-dropdown__anchor').getDOMNode(), preventDefault: jest.fn()};

        (wrapper.instance() as any).selectTopResult(closedEvent);

        expect(onSelect).not.toHaveBeenCalled();

        await act(async () => {
            wrapper!.find('.argo-dropdown__anchor').simulate('click', {stopPropagation: () => {}});
            await Promise.resolve();
        });
        wrapper.update();

        const outside = document.createElement('div');
        document.body.appendChild(outside);
        const outsideEvent: any = {key: 'Enter', target: outside, preventDefault: jest.fn()};

        (wrapper.instance() as any).selectTopResult(outsideEvent);

        expect(onSelect).not.toHaveBeenCalled();
        outside.remove();
    });
});
