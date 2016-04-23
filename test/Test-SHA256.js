import {SHA256} from './../src/hash/SHA256';
const assert = require('assert');

describe('SHA256', () => {
    describe('#hash', () => {
        it('should return hash for a empty string', () => {
            assert.equal('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', SHA256.hash(''));
        });
        it('should return hash for strings (1 character)', () => {
            assert.equal('ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', SHA256.hash('a'));
        });
        it('should return hash for strings (3 characters)', () => {
            assert.equal('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', SHA256.hash('abc'));
        });
        it('should return hash for strings containing spaces', () => {
            assert.equal('f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650', SHA256.hash('message digest'));
        });
        it('should return hash for strings containing no spaces', () => {
            assert.equal('71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73', SHA256.hash('abcdefghijklmnopqrstuvwxyz'));
        });
        it('should return hash for strings containing uppercase, lowercase and numericals', () => {
            assert.equal('db4bfcbd4da0cd85a60c3c37d3fbd8805c77f15fc6b1fdfe614ee0a7c8fdb4c0', SHA256.hash('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'));
        });
        it('should return hash for strings containing only numbers (80 characters)', () => {
            assert.equal('f371bc4a311f2b009eef952dd83ca80e2b60026c8e935592d0f9c308453c813e', SHA256.hash('12345678901234567890123456789012345678901234567890123456789012345678901234567890'));
        });
        it('should return hash for strings containing only numbers (160 characters)', () => {
            assert.equal('6e4ecb71dc148318e2fd61efd37b906f29205b5767bea7c89625fafdd2106b91', SHA256.hash('1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'));
        });
        it('should return a hash with length 64 characters', () => {
            const hash = SHA256.hash('cryptographic hash function');
            assert.equal(hash.length, 64);
        });
    });
});
