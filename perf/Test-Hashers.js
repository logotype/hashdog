import {MD5} from './../build/hash/MD5';
import {SHA1} from './../build/hash/SHA1';
import {SHA256} from './../build/hash/SHA256';
import {SHA512} from './../build/hash/SHA512';
import {Util} from './../build/util/Util';

Util.cls();
console.log('Running performance tests...');

let i, length = 1000000, startDate, dateDiff, rate, relativeRate, MD5Rate;

// 1st allocation
MD5.hash('allocate');
SHA1.hash('allocate');
SHA256.hash('allocate');
SHA512.hash('allocate');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    MD5.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
MD5Rate = rate;
console.log('   MD5 rate: ' + Util.numberWithCommas(rate.toFixed()) + ' hashes/sec');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    SHA1.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate/MD5Rate*100-100;
console.log('  SHA1 rate: ' + Util.numberWithCommas(rate.toFixed()) + ' hashes/sec -55.54 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower')  + ' than MD5)');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    SHA256.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate/MD5Rate*100-100;
console.log('SHA256 rate: ' + Util.numberWithCommas(rate.toFixed()) + ' hashes/sec -76.95 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower')  + ' than MD5)');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    SHA512.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate/MD5Rate*100-100;
console.log('SHA512 rate: ' + Util.numberWithCommas(rate.toFixed()) + ' hashes/sec -94.12 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower')  + ' than MD5)');

i = 0;
startDate = new Date();
for(i; i < length; i++) {
    MD5.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate/MD5Rate*100-100;
console.log('   MD5 rate: ' + Util.numberWithCommas(rate.toFixed()) + ' hashes/sec 0.00 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower')  + ' than MD5)');


console.log('Performance tests ran successfully.');
console.log('');