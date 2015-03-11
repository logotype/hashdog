import {MD5} from './../src/util/MD5';
var assert = require('assert');

describe('MD5', () => {
    it('should return a correct hash', () => {
        let hash = MD5.hash('tr1z');
        assert.equal(hash, '2655dd21148f2433763d313407d5d820');
    });
});