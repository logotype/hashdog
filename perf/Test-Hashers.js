import {MD5} from './../build/hash/MD5';
import {SHA1} from './../build/hash/SHA1';
import {SHA256} from './../build/hash/SHA256';
import {SHA512} from './../build/hash/SHA512';
import {Util} from './../build/util/Util';

Util.cls();
console.log('Running performance tests...');

let i, length = 1000000, startDate, dateDiff, rate;

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    MD5.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
console.log('   MD5 rate: ' + rate.toFixed(2) + ' hashes/sec');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    SHA1.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
console.log('  SHA1 rate: ' + rate.toFixed(2) + ' hashes/sec');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    SHA256.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
console.log('SHA256 rate: ' + rate.toFixed(2) + ' hashes/sec');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    SHA512.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
console.log('SHA512 rate: ' + rate.toFixed(2) + ' hashes/sec');

console.log('');