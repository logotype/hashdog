import MD5 from 'md5-es';
import SHA1 from 'sha1-es';
import SHA256 from 'sha256-es';
import SHA512 from 'sha512-es';

const numberWithCommas = (x) => {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

process.stdout.write('\u001B[2J\u001B[0;0f');
console.log('Running performance tests...');

let i, length = 1000000,
    startDate, dateDiff, rate, relativeRate, MD5Rate;

// 1st allocation
MD5.hash('allocate');
SHA1.hash('allocate');
SHA256.hash('allocate');
SHA512.hash('allocate');

i = 0;
startDate = new Date();
for (i; i < length; i++) {
    MD5.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
MD5Rate = rate;
console.log('   MD5 rate: ' + numberWithCommas(rate.toFixed()) + ' hashes/sec');

i = 0;
startDate = new Date();
for (i; i < length; i++) {
    SHA1.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate / MD5Rate * 100 - 100;
console.log('  SHA1 rate: ' + numberWithCommas(rate.toFixed()) + ' hashes/sec -40.06 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower') + ' than MD5)');

i = 0;
startDate = new Date();
for (i; i < length; i++) {
    SHA256.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate / MD5Rate * 100 - 100;
console.log('SHA256 rate: ' + numberWithCommas(rate.toFixed()) + ' hashes/sec -67.09 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower') + ' than MD5)');

i = 0;
startDate = new Date();
for (i; i < length; i++) {
    SHA512.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate / MD5Rate * 100 - 100;
console.log('SHA512 rate: ' + numberWithCommas(rate.toFixed()) + ' hashes/sec -94.41 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower') + ' than MD5)');

i = 0;
startDate = new Date();
for (i; i < length; i++) {
    MD5.hash(i.toString());
}
dateDiff = new Date() - startDate;
rate = (length / dateDiff) * 1000;
relativeRate = rate / MD5Rate * 100 - 100;
console.log('   MD5 rate: ' + numberWithCommas(rate.toFixed()) + ' hashes/sec 0.00 (' + Math.abs(relativeRate).toFixed(2) + '% ' + ((relativeRate >= 0) ? 'faster' : 'slower') + ' than first run)');


console.log('Performance tests ran successfully.');
console.log('');