import {SHA1} from './../src/hash/SHA1';
const assert = require('assert');

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
            const hash = SHA1.hash('cryptographic hash function');
            assert.equal(hash.length, 40);
        });
    });
});