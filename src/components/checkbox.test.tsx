import * as React from 'react';
import {render} from '@testing-library/react';
import {screen, fireEvent} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {Checkbox} from './checkbox';

test('Checkbox RTL: calls onChange and respects props', () => {
  const onChange = jest.fn();
  const {rerender} = render(<Checkbox checked={true} onChange={onChange} id="foo" />);

  const cb = screen.getByRole('checkbox');
  expect(cb).toBeChecked();
  expect(cb.id).toBe('foo');

  fireEvent.click(cb);
  expect(onChange).toHaveBeenCalledWith(false);

  rerender(<Checkbox checked={false} disabled={true} />);
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  expect(screen.getByRole('checkbox')).toBeDisabled();
});
