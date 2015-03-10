/*
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {Permutator} from './workers/Permutator';
import {MD5} from './util/MD5';
import {Wordlist} from './workers/Wordlist';
import {Passwords} from './workers/Passwords';
import {Util} from './util/Util';

export class HashDog {

    constructor(options) {

        if(!options || !options.hash || !options.length) {
            throw new Error('Missing options');
        }

        let self = this,
            worker, refreshRate = 120,
            cluster = require('cluster'),
            numCPUs = require('os').cpus().length;

        this.startDate = new Date();
        this.match = options.hash;
        this.fixedLength = options.length;
        this.md5 = new MD5();
        this.workers = [];
        this.status = {
            'wl': {},
            'pl': {},
            'sp': {}
        };
        this.wordlist = new Wordlist({match: this.match, refreshRate: refreshRate});
        this.passwords = new Passwords({match: this.match, refreshRate: refreshRate});
        this.permutator = new Permutator({match: this.match, refreshRate: refreshRate});

        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs - 1; i++) {
                worker = cluster.fork();
                worker.on('message', (msg) => {
                    if (msg.thread) {
                        self.display(msg);
                    }
                });
                this.workers.push(worker);
            }

            setTimeout(() => {
                for (let i = 0; i < self.workers.length; i++) {
                    self.workers[i].send({
                        thread: i + 1
                    });
                }
            }, 500);
        } else {
            process.on('message', (msg) => {
                if (msg.thread) {
                    switch (msg.thread) {
                        case 1:
                            self.wordlist.initialize({length: this.fixedLength});
                            break;
                        case 2:
                            self.passwords.initialize({length: this.fixedLength});
                            break;
                        case 3:
                            self.permutator.initialize({length: this.fixedLength, chars:'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789'});
                            break;
                    }
                }
            });
        }
    }

    display(msg) {
        let self = this,
            dateDiff,
            didSucceed = false,
            secret = '',
            i = 1,
            colors = require('colors/safe');

        this.status[msg.thread] = msg;

        if (this.status.wl.success === true) {
            didSucceed = true;
            secret = this.status.wl.string;
        } else if (this.status.pl.success === true) {
            didSucceed = true;
            secret = this.status.pl.string;
        } else if (this.status.sp.success === true) {
            didSucceed = true;
            secret = this.status.sp.string;
        }

        Util.cls();

        Object.keys(self.status).forEach((key) => {
            if (self.status[key].hasOwnProperty('status')) {
                console.log('THREAD ' + i + ':');
                console.log('  Worker...............: ' + self.status[key].name);
                console.log('  Status...............: ' + colors.yellow(self.status[key].status));
                console.log('  Success..............: ' + self.status[key].success);
                console.log('  Uptime...............: ' + self.status[key].uptime + ' seconds');
                console.log('  Keys (tried).........: ' + Util.numberWithCommas(self.status[key].keysTried));
                console.log('  Keys (total).........: ' + Util.numberWithCommas(self.status[key].keysTotal));
                console.log('  Percentage...........: ' + self.status[key].percentage + '%');
                console.log('  Rate.................: ' + self.status[key].rate + ' kHash/s');
                console.log('  String...............: ' + colors.cyan(self.status[key].string));
            }
            i++;
        });

        if (didSucceed) {
            dateDiff = new Date() - this.startDate;
            console.log('----------------------------------------------------------------------');
            console.log(this.match + ' : ' + colors.green(secret));
            console.log('The process took ' + (dateDiff / 1000).toFixed(2) + ' seconds.');
            process.exit(0);
        }
    }
}

export default HashDog;
