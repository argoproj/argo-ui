import { mount } from 'enzyme';
import {from} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import { Popup, PopupProps } from './popup';
import {PopupManager} from './popup-manager';

describe('PopupManager', () => {
    let scheduler: TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
    });

    describe('confirm', () => {
        it.each([
            ['OK', true, '[qe-id="argo-popup-ok-button"]'],
            ['Cancel', false, '[qe-id="argo-popup-cancel-button"]'],
        ])('%s', async (_, promiseResult, btnSelector) => {
            const fn = jest.fn<void, [null | PopupProps]>();
            const manager = new PopupManager();

            from(manager.popupProps, scheduler).subscribe(fn);
            scheduler.flush();

            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenLastCalledWith(null);

            const promise = manager.confirm('foo', 'bar');
            scheduler.flush();

            expect(fn).toHaveBeenCalledTimes(2);

            const props = fn.mock.calls[1][0]!;

            expect(typeof props).toBe('object');

            const popup = mount(Popup(props));

            expect(popup.find('.popup-container__header').text().trim()).toBe('foo');
            expect(popup.find('.popup-container__body').text()).toBe('bar');

            popup.find(btnSelector).simulate('click');

            await expect(promise).resolves.toBe(promiseResult);
            scheduler.flush();

            expect(fn).toHaveBeenCalledTimes(3);
            expect(fn).toHaveBeenLastCalledWith(null);
        });
    });
});
