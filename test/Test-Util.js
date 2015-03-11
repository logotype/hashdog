import {Util} from './../src/util/Util';
var assert = require('assert');

describe('Util', () => {
    describe('#numberWithCommas', () => {
        it('should return 100 for 100', () => {
            let number = Util.numberWithCommas(100);
            assert.equal(number, '100');
        });
        it('should return 1,000 for 1000', () => {
            let number = Util.numberWithCommas(1000);
            assert.equal(number, '1,000');
        });
        it('should return 13,845,841 for 13845841', () => {
            let number = Util.numberWithCommas(13845841);
            assert.equal(number, '13,845,841');
        });
    });
    describe('#replaceCharAtIndex', () => {
        it('should return replace the correct character at a given index', () => {
            let str = 'this is a example string';
            let result = Util.replaceCharAtIndex(str, 10, 'Z');
            assert.equal(result, 'this is a Zxample string');
        });
    });
});