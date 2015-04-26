import {SHA512} from './../src/hash/SHA512';
var assert = require('assert');

describe('SHA512', () => {
    describe('#hash', () => {
        it('should return hash for a empty string', () => {
            assert.equal('cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e', SHA512.hash(''));
        });
        it('should return hash for strings (1 character)', () => {
            assert.equal('1f40fc92da241694750979ee6cf582f2d5d7d28e18335de05abc54d0560e0f5302860c652bf08d560252aa5e74210546f369fbbbce8c12cfc7957b2652fe9a75', SHA512.hash('a'));
        });
        it('should return hash for strings (3 characters)', () => {
            assert.equal('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f', SHA512.hash('abc'));
        });
        it('should return hash for strings containing spaces', () => {
            assert.equal('107dbf389d9e9f71a3a95f6c055b9251bc5268c2be16d6c13492ea45b0199f3309e16455ab1e96118e8a905d5597b72038ddb372a89826046de66687bb420e7c', SHA512.hash('message digest'));
        });
        it('should return hash for strings containing no spaces', () => {
            assert.equal('4dbff86cc2ca1bae1e16468a05cb9881c97f1753bce3619034898faa1aabe429955a1bf8ec483d7421fe3c1646613a59ed5441fb0f321389f77f48a879c7b1f1', SHA512.hash('abcdefghijklmnopqrstuvwxyz'));
        });
        it('should return hash for strings containing uppercase, lowercase and numericals', () => {
            assert.equal('1e07be23c26a86ea37ea810c8ec7809352515a970e9253c26f536cfc7a9996c45c8370583e0a78fa4a90041d71a4ceab7423f19c71b9d5a3e01249f0bebd5894', SHA512.hash('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'));
        });
        it('should return hash for strings containing only numbers (80 characters)', () => {
            assert.equal('72ec1ef1124a45b047e8b7c75a932195135bb61de24ec0d1914042246e0aec3a2354e093d76f3048b456764346900cb130d2a4fd5dd16abb5e30bcb850dee843', SHA512.hash('12345678901234567890123456789012345678901234567890123456789012345678901234567890'));
        });
        it('should return hash for strings containing only numbers (160 characters)', () => {
            assert.equal('72bf79456740d55c96ad9301a353d6f821910ae3b2e9b2f40220630d4fc61c2c2d8ce3fa42a2fb744b39d59f08ba5f3678972b20a1c7ae5061d4919f1b1b0234', SHA512.hash('1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'));
        });
        it('should return a hash with length 128 characters', () => {
            let hash = SHA512.hash('cryptographic hash function');
            assert.equal(hash.length, 128);
        });
    });
});