import HashDog from './../src/HashDog';

describe('HashDog', () => {
    describe('#constructor', () => {
        let hashdog = null; // eslint-disable-line no-unused-vars
        afterEach((done) => {
            hashdog = null;
            done();
        });
        it('should throw an error when missing options', () => {
            expect(() => {
                hashdog = new HashDog();
            }).toThrowError('Missing options!');
        });
        it('should throw an error when passing incomplete options', () => {
            expect(() => {
                hashdog = new HashDog({});
            }).toThrowError('Missing options!');
        });
        it('should throw an error when passing incorrect hash', () => {
            expect(() => {
                hashdog = new HashDog({
                    hash: 'incorrect',
                    type: 'SHA1'
                });
            }).toThrowError('Invalid SHA1 hash!');
        });
        it('should throw an error when passing incorrect type', () => {
            expect(() => {
                hashdog = new HashDog({
                    hash: '6d86ca3c74636711371637c2d73ec3e48dd1737a',
                    type: 'incorrect'
                });
            }).toThrowError('Unsupported hash type');
        });
    });
});
