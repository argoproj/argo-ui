import * as React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {SlidingPanel} from './sliding-panel';

describe('SlidingPanel', () => {
    test('close button is not aria-hidden while it can hold focus', () => {
        render(
            <SlidingPanel isShown={true} onClose={() => undefined}>
                <div>content</div>
            </SlidingPanel>
        );

        const closeButton = screen.getByRole('button', {name: /close/i});
        expect(closeButton).not.toHaveAttribute('aria-hidden');
    });

    test('close button receives focus on mount and remains accessible to assistive tech', () => {
        render(
            <SlidingPanel isShown={true} onClose={() => undefined}>
                <div>content</div>
            </SlidingPanel>
        );

        const closeButton = screen.getByRole('button', {name: /close/i});
        expect(closeButton).toHaveFocus();
        expect(closeButton.closest('[aria-hidden="true"]')).toBeNull();
    });

    test('close button has an accessible name even though its icon is decorative', () => {
        render(
            <SlidingPanel isShown={true} onClose={() => undefined}>
                <div>content</div>
            </SlidingPanel>
        );

        const closeButton = screen.getByRole('button', {name: /close/i});
        const icon = closeButton.querySelector('.argo-icon-close');

        expect(closeButton).toHaveAccessibleName();
        expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    test('close button is not rendered at all when the panel is not shown', () => {
        render(
            <SlidingPanel isShown={false} onClose={() => undefined}>
                <div>content</div>
            </SlidingPanel>
        );

        expect(screen.queryByRole('button', {name: /close/i})).not.toBeInTheDocument();
    });
});
