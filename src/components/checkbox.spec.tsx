import {shallow} from 'enzyme';
import * as React from 'react';
import {Checkbox} from './checkbox';

describe('Checkbox', () => {
    it('should invoke onChange when clicked', () => {
        const onChange = jest.fn();

        const checkbox = shallow(<Checkbox checked={true} onChange={onChange} />);

        checkbox.find('input').simulate('change');

        expect(onChange).toHaveBeenCalledWith(false);
    });

    it.each([true, false])('should render the checkbox with the correct value (%s)', (checked) => {
        const checkbox = shallow(<Checkbox checked={checked} />);
        expect(checkbox.find('input').filterWhere((item) => item.prop('checked') === checked).length).toBe(1);
    });

    it('should set the id of the resulting input', () => {
        const checkbox = shallow(<Checkbox id={'foo'} />);

        expect(checkbox.find('input').is('#foo')).toBe(true);
        checkbox.setProps({id: 'bar'});
        expect(checkbox.find('input').is('#bar')).toBe(true);
    });

    it('should set disabled of the resulting input', () => {
        const checkbox = shallow(<Checkbox disabled={true} />);

        expect(checkbox.find('input').filterWhere((item) => item.prop('disabled') === true).length).toBe(1);
        checkbox.setProps({disabled: false});
        expect(checkbox.find('input').filterWhere((item) => item.prop('disabled') === false).length).toBe(1);
    });
});
