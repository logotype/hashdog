#!/usr/bin/env node
import {HashDog} from './hashdog';

process.title = 'hashdog';

var program = require('commander'),
    path = require('path'),
    pkg = require(path.join(__dirname, '../package.json')),
    hashDog;

program
    .version(pkg.version)
    .option('-h, --hash <hash>', 'hash')
    .option('-t, --type <type>', 'type of hash <md5, sha1> (defaults to md5)')
    .option('-l, --length <length>', 'length of password string (defaults to 6)', parseInt)
    .option('-c, --chars <chars>', 'characters used for permutation (defaults to ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789)')
    .parse(process.argv);

if (!program.hash)
    throw new Error('Parameters required: --hash\n\n');

hashDog = new HashDog({hash: program.hash, type: program.type, length: program.length, chars: program.chars});