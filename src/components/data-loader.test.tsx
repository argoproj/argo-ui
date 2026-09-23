import * as React from 'react';
import {act, render} from '@testing-library/react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {DataLoader} from './data-loader';

// suspends its subtree from suspend() until reveal(), hiding committed siblings
const createSuspender = () => {
  let resolveGate: () => void;
  const gate = new Promise<void>((resolve) => (resolveGate = resolve));
  let suspended = false;
  const pending = gate.then((): void => {
    suspended = false;
  });
  const MaybeSuspend = (): null => {
    if (suspended) {
      throw pending;
    }
    return null;
  };
  const suspend = (): void => {
    suspended = true;
  };
  const reveal = (): Promise<void> => {
    resolveGate();
    return pending;
  };
  return {MaybeSuspend, suspend, reveal};
};

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

test('DataLoader RTL: keeps receiving observable emissions after Suspense hides and re-shows the tree', async () => {
  const subject = new BehaviorSubject('first');
  const {MaybeSuspend, suspend, reveal} = createSuspender();

  const makeTree = () => (
    <React.Suspense fallback={<p>fallback</p>}>
      <DataLoader load={() => subject}>
        {(result) => <p>{result}</p>}
      </DataLoader>
      <MaybeSuspend />
    </React.Suspense>
  );

  const {rerender} = render(makeTree());
  await waitFor(() => expect(screen.getByText('first')).toBeInTheDocument());

  suspend();
  rerender(makeTree());
  await waitFor(() => expect(screen.getByText('fallback')).toBeInTheDocument());

  await act(() => reveal());
  await waitFor(() => expect(screen.getByText('first')).toBeInTheDocument());

  act(() => subject.next('second'));
  await waitFor(() => expect(screen.getByText('second')).toBeInTheDocument());
});

test('DataLoader RTL: resubscribes when hidden before the observable emitted its first value', async () => {
  const subject = new Subject<string>();
  const {MaybeSuspend, suspend, reveal} = createSuspender();

  const makeTree = () => (
    <React.Suspense fallback={<p>fallback</p>}>
      <DataLoader load={() => subject}>
        {(result) => <p>{result}</p>}
      </DataLoader>
      <MaybeSuspend />
    </React.Suspense>
  );

  const {rerender} = render(makeTree());
  await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());

  suspend();
  rerender(makeTree());
  await waitFor(() => expect(screen.getByText('fallback')).toBeInTheDocument());

  await act(() => reveal());
  act(() => subject.next('late'));
  await waitFor(() => expect(screen.getByText('late')).toBeInTheDocument());
});

test('DataLoader RTL: does not reload a resolved promise-based load on hide and re-show', async () => {
  const loadFn = jest.fn().mockResolvedValue('foo');
  const {MaybeSuspend, suspend, reveal} = createSuspender();

  const makeTree = () => (
    <React.Suspense fallback={<p>fallback</p>}>
      <DataLoader load={loadFn}>
        {(result) => <p>{result}</p>}
      </DataLoader>
      <MaybeSuspend />
    </React.Suspense>
  );

  const {rerender} = render(makeTree());
  await waitFor(() => expect(screen.getByText('foo')).toBeInTheDocument());

  suspend();
  rerender(makeTree());
  await waitFor(() => expect(screen.getByText('fallback')).toBeInTheDocument());

  await act(() => reveal());
  await waitFor(() => expect(screen.getByText('foo')).toBeInTheDocument());
  expect(loadFn).toHaveBeenCalledTimes(1);
});

test('DataLoader RTL: re-runs a promise-based load whose result arrived while hidden', async () => {
  const resolvers: Array<(value: string) => void> = [];
  const loadFn = jest.fn(() => new Promise<string>((resolve) => resolvers.push(resolve)));
  const {MaybeSuspend, suspend, reveal} = createSuspender();

  const makeTree = () => (
    <React.Suspense fallback={<p>fallback</p>}>
      <DataLoader load={loadFn}>
        {(result) => <p>{result}</p>}
      </DataLoader>
      <MaybeSuspend />
    </React.Suspense>
  );

  const {rerender} = render(makeTree());
  await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());

  suspend();
  rerender(makeTree());
  await waitFor(() => expect(screen.getByText('fallback')).toBeInTheDocument());

  await act(async () => resolvers[0]('dropped'));
  await act(() => reveal());

  await act(async () => resolvers[1]('done'));
  await waitFor(() => expect(screen.getByText('done')).toBeInTheDocument());
  expect(loadFn).toHaveBeenCalledTimes(2);
});

test('DataLoader RTL: does not reload a completed observable on hide and re-show', async () => {
  const loadFn = jest.fn(() => of('foo'));
  const {MaybeSuspend, suspend, reveal} = createSuspender();

  const makeTree = () => (
    <React.Suspense fallback={<p>fallback</p>}>
      <DataLoader load={loadFn}>
        {(result) => <p>{result}</p>}
      </DataLoader>
      <MaybeSuspend />
    </React.Suspense>
  );

  const {rerender} = render(makeTree());
  await waitFor(() => expect(screen.getByText('foo')).toBeInTheDocument());

  suspend();
  rerender(makeTree());
  await waitFor(() => expect(screen.getByText('fallback')).toBeInTheDocument());

  await act(() => reveal());
  await waitFor(() => expect(screen.getByText('foo')).toBeInTheDocument());
  expect(loadFn).toHaveBeenCalledTimes(1);
});
