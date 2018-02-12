import { expect } from 'chai';

import { Utils } from './utils';

describe('Utils', () => {
    it('returns correct short node name', () => {
        expect(Utils.shortNodeName('ci-example-kxzs4')).to.be.eq('ci-example-kxzs4');
        expect(Utils.shortNodeName('ci-example-kxzs4[1].test')).to.be.eq('test');
        expect(Utils.shortNodeName('ci-example-kxzs4[1].test(image:ubuntu,tag:17.10)')).to.be.eq('test(image:ubuntu,tag:17.10)');
        expect(Utils.shortNodeName('ci-example-kxzs4[1].test(image:ubuntu,tag:17.10)[0].subTest')).to.be.eq('subTest');
        expect(Utils.shortNodeName('ci-example-kxzs4[1].test(image:ubuntu,tag:17.10)[0].subTest(tag1.2)')).to.be.eq('subTest(tag1.2)');
    });
});
