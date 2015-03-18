import {MD5} from './../src/hash/MD5';
import {SHA1} from './../src/hash/SHA1';
import {SHA256} from './../src/hash/SHA256';
import {SHA512} from './../src/hash/SHA512';
var assert = require('assert');

describe('Hashers', () => {
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
    describe('SHA1', () => {
        describe('#hash', () => {
            it('should return hash for a empty string', () => {
                assert.equal('da39a3ee5e6b4b0d3255bfef95601890afd80709', SHA1.hash(''));
            });
            it('should return hash for strings (1 character)', () => {
                assert.equal('86f7e437faa5a7fce15d1ddcb9eaeaea377667b8', SHA1.hash('a'));
            });
            it('should return hash for strings (3 characters)', () => {
                assert.equal('a9993e364706816aba3e25717850c26c9cd0d89d', SHA1.hash('abc'));
            });
            it('should return hash for strings containing spaces', () => {
                assert.equal('c12252ceda8be8994d5fa0290a47231c1d16aae3', SHA1.hash('message digest'));
            });
            it('should return hash for strings containing no spaces', () => {
                assert.equal('32d10c7b8cf96570ca04ce37f2a19d84240d3a89', SHA1.hash('abcdefghijklmnopqrstuvwxyz'));
            });
            it('should return hash for strings containing uppercase, lowercase and numericals', () => {
                assert.equal('761c457bf73b14d27e9e9265c46f4b4dda11f940', SHA1.hash('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'));
            });
            it('should return hash for strings containing only numbers (80 characters)', () => {
                assert.equal('50abf5706a150990a08b2c5ea40fa0e585554732', SHA1.hash('12345678901234567890123456789012345678901234567890123456789012345678901234567890'));
            });
            it('should return hash for strings containing only numbers (160 characters)', () => {
                assert.equal('38f11bc1b1f19016e253c31064e04259d944b325', SHA1.hash('1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'));
            });
            it('should return a hash with length 40 characters', () => {
                let hash = SHA1.hash('cryptographic hash function');
                assert.equal(hash.length, 40);
            });
        });
    });
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
                let hash = SHA256.hash('cryptographic hash function');
                assert.equal(hash.length, 64);
            });
        });
    });
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
});