import {HashDog} from './../src/HashDog';
var assert = require('assert');

describe('HashDog', () => {
    describe('#constructor', () => {
        let hashdog;
        after((done) => {
            hashdog = null;
            done();
        });
        it('should throw an error when missing options', (done) => {
            assert.throws(() => {
                hashdog = new HashDog();
            }, Error);
            done();
        });
        it('should throw an error when passing incomplete options', (done) => {
            assert.throws(() => {
                hashdog = new HashDog({});
            }, Error);
            done();
        });
        it('should throw an error when passing incorrect hash', (done) => {
            assert.throws(() => {
                hashdog = new HashDog({hash:'incorrect', type:'SHA1'});
            }, Error);
            done();
        });
        it('should throw an error when passing incorrect type', (done) => {
            assert.throws(() => {
                hashdog = new HashDog({hash:'6d86ca3c74636711371637c2d73ec3e48dd1737a', type:'incorrect'});
            }, Error);
            done();
        });
    });
});