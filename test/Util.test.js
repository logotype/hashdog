import { Util } from './../src/util/Util';

describe('Util', () => {
    describe('#numberWithCommas', () => {
        it('should return 100 for 100', () => {
            const number = Util.numberWithCommas(100);
            expect(number).toBe('100');
        });
        it('should return 1,000 for 1000', () => {
            const number = Util.numberWithCommas(1000);
            expect(number).toBe('1,000');
        });
        it('should return 13,845,841 for 13845841', () => {
            const number = Util.numberWithCommas(13845841);
            expect(number).toBe('13,845,841');
        });
    });
    describe('#replaceCharAtIndex', () => {
        it('should return replace the correct character at a given index', () => {
            const str = 'this is a example string';
            const result = Util.replaceCharAtIndex(str, 10, 'Z');
            expect(result).toBe('this is a Zxample string');
        });
    });
});
