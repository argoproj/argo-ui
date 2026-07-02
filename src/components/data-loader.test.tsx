import * as React from 'react';
import {render} from '@testing-library/react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {DataLoader} from './data-loader';

test('DataLoader RTL: renders result of promise-based load', async () => {
  const promise = Promise.resolve('foo');
  render(
    <DataLoader load={() => promise}>
      {(result) => <p>{result}</p>}
    </DataLoader>,
  );

  await waitFor(() => expect(screen.getByText('foo')).toBeInTheDocument());
});

test('DataLoader RTL: calls load with input when provided', async () => {
  const loadFn = jest.fn().mockResolvedValue('foo');
  render(
    <DataLoader load={loadFn} input={'bar'}>
      {(result) => <p>{result}</p>}
    </DataLoader>,
  );

  await waitFor(() => expect(screen.getByText('foo')).toBeInTheDocument());
  expect(loadFn).toHaveBeenCalledWith('bar');
});
