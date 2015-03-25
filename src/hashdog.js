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
import {Task} from './queue/Task';
import {EventEmitter} from 'events';

export class HashDog extends EventEmitter {

    constructor(options) {

        const SHA1RegExp = /^[0-9a-f]{40}$/i;
        const SHA256RegExp = /^[0-9a-f]{64}$/i;
        const SHA512RegExp = /^[0-9a-f]{128}$/i;
        const MD5RegExp = /^[0-9a-f]{32}$/i;

        let i = 0,
            len, task, numCPUs = require('os').cpus().length;

        if (!options || !options.hash) {
            throw new Error('Missing options!');
        } else if (!options.hash) {
            throw new Error('Missing hash!');
        } else if (!options.type) {
            if (MD5RegExp.test(options.hash)) {
                options.type = 'MD5';
            } else if (SHA1RegExp.test(options.hash)) {
                options.type = 'SHA1';
            } else if (SHA256RegExp.test(options.hash)) {
                options.type = 'SHA256';
            } else if (SHA512RegExp.test(options.hash)) {
                options.type = 'SHA512';
            } else {
                throw new Error('Please specify hash type!');
            }
        }

        switch (options.type) {
            case 'MD5':
                if (!MD5RegExp.test(options.hash)) {
                    throw new Error('Invalid MD5 hash!');
                }
                break;
            case 'SHA1':
                if (!SHA1RegExp.test(options.hash)) {
                    throw new Error('Invalid SHA1 hash!');
                }
                break;
            case 'SHA256':
                if (!SHA256RegExp.test(options.hash)) {
                    throw new Error('Invalid SHA256 hash!');
                }
                break;
            case 'SHA512':
                if (!SHA512RegExp.test(options.hash)) {
                    throw new Error('Invalid SHA512 hash!');
                }
                break;
        }

        if (options && options.environment === 'CLI') {
            this.environment = 'CLI';
        } else {
            this.environment = 'LIB';
        }

        this.cluster = require('cluster');
        this.refreshRate = 500;
        this.startDate = new Date();
        this.match = options.hash.toLowerCase();
        this.type = options.type;
        this.chars = options.chars || 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.fixedLength = options.length;
        this.workers = new Map();
        this.status = new Map();
        this.lastDate = new Date();
        this.wordlist = new Wordlist({match: this.match, type: this.type, refreshRate: this.refreshRate});
        this.passwords = new Passwords({match: this.match, type: this.type, refreshRate: this.refreshRate});
        this.permutator = new Permutator({match: this.match, type: this.type, refreshRate: this.refreshRate});

        if (this.cluster.isMaster) {

            // Setup default workers
            task = new Task({type: 'WORDLIST'});
            this.addWorker(task);

            task = new Task({type: 'PASSWORD'});
            this.addWorker(task);

            if (this.fixedLength) {
                task = new Task({type: 'PERMUTATOR', length: this.fixedLength});
                this.addWorker(task);
            } else {
                len = Math.abs(numCPUs - this.workers.size);
                for (i = 0; i < len; i++) {
                    this.permutator.currentMaxLength++;
                    task = new Task({type: 'PERMUTATOR', length: this.permutator.currentMaxLength});
                    this.addWorker(task);
                }
            }

        } else if (this.cluster.isWorker) {
            process.on('message', (data) => {
                this.messageHandler(data);
            });
        }
    }

    addWorker(task) {
        let worker = this.cluster.fork();
        task.workerId = worker.id;
        worker.on('message', (data) => {this.messageHandler(data);});
        this.workers.set(worker.id.toString(), task);
        worker.send(task);
    }

    deleteWorker(workerId) {
        this.cluster.workers[workerId].kill();
        this.cluster.workers[workerId].removeAllListeners('message');
        this.workers.delete(workerId);
        this.status.delete(workerId);
    }

    messageHandler(data) {
        if (this.cluster.isMaster) {
            if (data.hasOwnProperty('command')) {
                switch (data.command) {
                    case 'DISPLAY':
                        if (this.environment === 'CLI') {
                            this.display(data);
                        } else if (this.environment === 'LIB') {
                            this.sendEvents(data);
                        }
                        break;
                    case 'DONE':
                        this.deleteWorker(data.workerId);
                        this.permutator.currentMaxLength++;
                        let task = new Task({
                            type: 'PERMUTATOR',
                            length: this.permutator.currentMaxLength
                        });
                        this.addWorker(task);
                        break;
                }
            }
        } else if (this.cluster.isWorker) {
            if (data.hasOwnProperty('command')) {
                if (data.command === 'setupWorker') {
                    switch (data.options.type) {
                        case 'WORDLIST':
                            this.wordlist.initializeWorker(data.workerId);
                            this.wordlist.initialize({
                                length: this.fixedLength
                            });
                            break;
                        case 'PASSWORD':
                            this.passwords.initializeWorker(data.workerId);
                            this.passwords.initialize({
                                length: this.fixedLength
                            });
                            break;
                        case 'PERMUTATOR':
                            this.permutator.initializeWorker(data.workerId);
                            this.permutator.initialize({
                                length: data.options.length,
                                chars: this.chars
                            });
                            break;
                    }
                }
            }
        }
    }

    display(data) {
        let currentDate = new Date(),
            dateDiff,
            didSucceed = false,
            secret = '',
            i = 1,
            totalRate = 0,
            colors = require('colors/safe');

        this.status.set(data.workerId, data);

        dateDiff = currentDate - this.lastDate;

        if (dateDiff <= this.refreshRate) {
            return;
        }

        Util.cls();

        this.status.forEach((data) => {
            if (data.hasOwnProperty('status') && (data.status === 'Working' || data.status === 'SUCCESS')) {
                totalRate += data.rate;
            }
            if (data.success === true) {
                didSucceed = true;
                secret = data.string;
            }
        });

        console.log('hashdog by @logotype. Copyright © 2015. Released under the MIT license.');
        console.log('Hash: ' + colors.yellow(this.match) + ' type: ' + colors.magenta(this.type) + ' characters: ' + colors.cyan(this.chars));
        console.log('Current rate combined..: ' + totalRate.toFixed(2) + ' kHash/s');
        console.log('');

        this.status.forEach((data) => {
            if (data.hasOwnProperty('status')) {
                console.log('PROCESS ' + data.workerId + ': ' + data.name);
                console.log('  Status...............: ' + colors.yellow(data.status));
                console.log('  Uptime...............: ' + data.uptime + ' seconds');
                console.log('  Key length...........: ' + Util.numberWithCommas(data.keyLength));
                console.log('  Keys (tried).........: ' + Util.numberWithCommas(data.keysTried));
                console.log('  Keys (total).........: ' + Util.numberWithCommas(data.keysTotal));
                console.log('  Percentage...........: ' + data.percentage + '%');
                console.log('  Rate.................: ' + data.rate.toFixed(2) + ' kHash/s');
                console.log('  String...............: ' + colors.cyan(data.string));
            }
            i++;
        });

        if (didSucceed) {
            dateDiff = currentDate - this.startDate;
            console.log('----------------------------------------------------------------------');
            console.log('Started................: ' + this.startDate.toUTCString());
            console.log('Ended..................: ' + currentDate.toUTCString());
            console.log('The process took ' + (dateDiff / 1000).toFixed(2) + ' seconds.');
            console.log(this.match + ' : ' + colors.green(secret));
            process.exit(0);
        }
        this.lastDate = currentDate;
    }

    sendEvents(data) {
        let didSucceed = false,
            secret = '';

        this.status.set(data.workerId, data);

        this.status.forEach((data) => {
            if (data.hasOwnProperty('status')) {
                this.emit('progress', data);
            }
            if (data.success === true) {
                didSucceed = true;
                secret = data.string;
            }
        });

        if (didSucceed) {
            this.emit('success', {
                hash: this.match,
                string: secret
            });
            process.exit(0);
        }
    }
}

export default HashDog;