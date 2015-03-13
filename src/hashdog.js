/*
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {Permutator} from './workers/Permutator';
import {Wordlist} from './workers/Wordlist';
import {Passwords} from './workers/Passwords';
import {Util} from './util/Util';

export class HashDog {

    constructor(options) {

        if(!options || !options.hash) {
            throw new Error('Missing options!');
        } else if(!options.hash) {
            throw new Error('Missing hash!');
        } else if(!options.type) {
            throw new Error('Missing hash type!');
        }

        let self = this,
            worker, refreshRate = 500,
            cluster = require('cluster'),
            numCPUs = require('os').cpus().length;

        this.startDate = new Date();
        this.match = options.hash;
        this.type = options.type;
        this.chars = options.chars || 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.fixedLength = options.length;
        this.workers = [];
        this.status = {
            'wl': {},
            'pl': {},
            'sp': {}
        };
        this.wordlist = new Wordlist({match: this.match, type: this.type, refreshRate: refreshRate});
        this.passwords = new Passwords({match: this.match, type: this.type, refreshRate: refreshRate});
        this.permutator = new Permutator({match: this.match, type: this.type, refreshRate: refreshRate});

        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs - 1; i++) {
                worker = cluster.fork();
                worker.on('message', (data) => {
                    if (data.type === 'display') {
                        self.display(data);
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
                            if(!this.fixedLength) {
                                self.permutator.tryCompleteKeyspace = true;
                            }
                            self.permutator.initialize({length: this.fixedLength, chars:this.chars});
                            break;
                    }
                }
            });
        }
    }

    display(data) {
        let self = this,
            endDate,
            dateDiff,
            didSucceed = false,
            secret = '',
            i = 1,
            colors = require('colors/safe');

        this.status[data.thread] = data;

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

        console.log('hashdog by @logotype. Copyright © 2015. Released under the MIT license.');
        console.log('Hash: ' + colors.yellow(self.match) + ' type: ' + colors.magenta(self.type) + ' characters: ' + colors.cyan(self.chars));
        console.log('');

        Object.keys(self.status).forEach((key) => {
            if (self.status[key].hasOwnProperty('status')) {
                console.log('THREAD ' + i + ':');
                console.log('  Worker...............: ' + self.status[key].name);
                console.log('  Status...............: ' + colors.yellow(self.status[key].status));
                console.log('  Success..............: ' + self.status[key].success);
                console.log('  Uptime...............: ' + self.status[key].uptime + ' seconds');
                console.log('  Key length...........: ' + Util.numberWithCommas(self.status[key].keyLength));
                console.log('  Keys (tried).........: ' + Util.numberWithCommas(self.status[key].keysTried));
                console.log('  Keys (total).........: ' + Util.numberWithCommas(self.status[key].keysTotal));
                console.log('  Percentage...........: ' + self.status[key].percentage + '%');
                console.log('  Rate.................: ' + self.status[key].rate + ' kHash/s');
                console.log('  String...............: ' + colors.cyan(self.status[key].string));
            }
            i++;
        });

        if (didSucceed) {
            endDate = new Date();
            dateDiff = endDate - this.startDate;
            console.log('----------------------------------------------------------------------');
            console.log(this.match + ' : ' + colors.green(secret));
            console.log('Started................: ' + this.startDate.toUTCString());
            console.log('Ended..................: ' + endDate.toUTCString());
            console.log('The process took ' + (dateDiff / 1000).toFixed(2) + ' seconds.');
            process.exit(0);
        }
    }
}

export default HashDog;
