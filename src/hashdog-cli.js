#!/usr/bin/env node
import {HashDog} from './hashdog';

process.title = 'hashdog';

var program = require('commander'),
    path = require('path'),
    pkg = require(path.join(__dirname, '../package.json')),
    hashDog;

program
    .version(pkg.version)
    .option('-m, --md5 <md5>', 'MD5 hash')
    .option('-l, --length <length>', 'length of password string (defaults to 6)', parseInt)
    .option('-c, --chars <chars>', 'characters used for permutation (defaults to ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789)')
    .parse(process.argv);

if (!program.md5)
    throw new Error('Parameters required: --md5\n\n');

hashDog = new HashDog({hash: program.md5, length: program.length, chars: program.chars});