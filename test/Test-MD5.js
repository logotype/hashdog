import {MD5} from './../src/hash/MD5';
var assert = require('assert');

describe('MD5', () => {
    describe('#hash', () => {
        it('should return hash for a empty string', () => {
            assert.equal('d41d8cd98f00b204e9800998ecf8427e', MD5.hash(''));
        });
        it('should return hash for strings (1 character)', () => {
            assert.equal('0cc175b9c0f1b6a831c399e269772661', MD5.hash('a'));
        });
        it('should return hash for strings (3 characters)', () => {
            assert.equal('900150983cd24fb0d6963f7d28e17f72', MD5.hash('abc'));
        });
        it('should return hash for strings containing spaces', () => {
            assert.equal('f96b697d7cb7938d525a2f31aaf161d0', MD5.hash('message digest'));
        });
        it('should return hash for strings containing no spaces', () => {
            assert.equal('c3fcd3d76192e4007dfb496cca67e13b', MD5.hash('abcdefghijklmnopqrstuvwxyz'));
        });
        it('should return hash for strings containing uppercase, lowercase and numericals', () => {
            assert.equal('d174ab98d277d9f5a5611c2c9f419d9f', MD5.hash('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'));
        });
        it('should return hash for strings containing only numbers (80 characters)', () => {
            assert.equal('57edf4a22be3c955ac49da2e2107b67a', MD5.hash('12345678901234567890123456789012345678901234567890123456789012345678901234567890'));
        });
        it('should return hash for strings containing only numbers (160 characters)', () => {
            assert.equal('268c7919189d85e276d74b8c60b2f84f', MD5.hash('1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'));
        });
        it('should return a hash with length 32 characters', () => {
            let hash = MD5.hash('cryptographic hash function');
            assert.equal(hash.length, 32);
        });
    });
});