#!/usr/bin/env node
import {HashDog} from '../build/hashdog';

process.title = 'hashdog';

var program = require('commander'),
    path = require('path'),
    pkg = require(path.join(__dirname, '../package.json')),
    hashDog;

program
    .version(pkg.version)
    .usage('2655dd21148f2433763d313407d5d820')
    .option('-t, --type [type]', 'type of hash: MD5, SHA1, SHA256, SHA512 (defaults to auto detect)')
    .option('-l, --length [length>', 'fixed length of password string (defaults to range 0-16)', parseInt)
    .option('-c, --chars [chars]', 'characters used for permutation (defaults to ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789)')
    .parse(process.argv);

if (!program.args.length) {
    program.help();
} else {
    hashDog = new HashDog({hash: program.args[0], type: program.type, length: program.length, chars: program.chars, environment: 'CLI'});
}