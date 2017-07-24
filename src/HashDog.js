/*
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2017 Victor Norgren
 * Released under the MIT license
 */
import {Permutator} from './workers/Permutator';
import {Wordlist} from './workers/Wordlist';
import {Passwords} from './workers/Passwords';
import {Util} from './util/Util';
import {Task} from './queue/Task';
import {EventEmitter} from 'events';

export class HashDog extends EventEmitter {

    static SHA1RegExp = /^[0-9a-f]{40}$/i;
    static SHA256RegExp = /^[0-9a-f]{64}$/i;
    static SHA512RegExp = /^[0-9a-f]{128}$/i;
    static MD5RegExp = /^[0-9a-f]{32}$/i;

    constructor(options) {
        super(options);

        const numCPUs = require('os').cpus().length;
        let i = 0, len = 0, task = null;

        this.checkOptionParameters(options);
        this.checkOptionTypes(options);

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

    checkOptionParameters(options) {
        if (!options || !options.hash) {
            throw new Error('Missing options!');
        } else if (!options.hash) {
            throw new Error('Missing hash!');
        } else if (!options.type) {
            if (HashDog.MD5RegExp.test(options.hash)) {
                options.type = 'MD5';
            } else if (HashDog.SHA1RegExp.test(options.hash)) {
                options.type = 'SHA1';
            } else if (HashDog.SHA256RegExp.test(options.hash)) {
                options.type = 'SHA256';
            } else if (HashDog.SHA512RegExp.test(options.hash)) {
                options.type = 'SHA512';
            } else {
                throw new Error('Please specify hash type!');
            }
        }
    }

    checkOptionTypes(options) {
        switch (options.type) {
            case 'MD5':
                if (!HashDog.MD5RegExp.test(options.hash)) {
                    throw new Error('Invalid MD5 hash!');
                }
                break;
            case 'SHA1':
                if (!HashDog.SHA1RegExp.test(options.hash)) {
                    throw new Error('Invalid SHA1 hash!');
                }
                break;
            case 'SHA256':
                if (!HashDog.SHA256RegExp.test(options.hash)) {
                    throw new Error('Invalid SHA256 hash!');
                }
                break;
            case 'SHA512':
                if (!HashDog.SHA512RegExp.test(options.hash)) {
                    throw new Error('Invalid SHA512 hash!');
                }
                break;
            default:
                break;
        }
    }

    addWorker(task) {
        const worker = this.cluster.fork();
        task.workerId = worker.id;
        worker.on('message', (data) => {this.messageHandler(data);});
        this.workers.set(worker.id.toString(), task);
        worker.send(task);
    }

    deleteWorker(workerId) {
        this.cluster.workers[workerId].removeAllListeners('message');
        this.cluster.workers[workerId].kill();
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
                    case 'DONE': {
                            this.deleteWorker(data.workerId);
                            this.permutator.currentMaxLength++;
                            const task = new Task({
                                type: 'PERMUTATOR',
                                length: this.permutator.currentMaxLength
                            });
                            this.addWorker(task);
                        }
                        break;
                    default:
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
                        default:
                            break;
                    }
                }
            }
        }
    }

    display(data) {
        const currentDate = new Date(),
            colors = require('colors/safe');

        let dateDiff = currentDate - this.lastDate,
            didSucceed = false,
            secret = '',
            totalRate = 0;

        this.status.set(data.workerId, data);

        if (dateDiff <= this.refreshRate) {
            return;
        }

        Util.cls();

        this.status.forEach((statusData) => {
            if (statusData.hasOwnProperty('status') && (statusData.status === 'Working' || statusData.status === 'SUCCESS')) {
                totalRate += statusData.rate;
            }
            if (statusData.success === true) {
                didSucceed = true;
                secret = statusData.string;
            }
        });

        console.log('hashdog by @logotype. Copyright © 2017. Released under the MIT license.');
        console.log(`Hash: ${colors.yellow(this.match)} type: ${colors.magenta(this.type)} characters: ${colors.cyan(this.chars)}`);
        console.log(`Current rate combined..: ${totalRate.toFixed(2)} kHash/s`);
        console.log('');

        this.status.forEach((statusData) => {
            if (statusData.hasOwnProperty('status')) {
                console.log(`PROCESS ${statusData.workerId}: ${statusData.name}`);
                console.log(`  Status...............: ${colors.yellow(statusData.status)}`);
                console.log(`  Uptime...............: ${statusData.uptime} seconds`);
                console.log(`  Key length...........: ${Util.numberWithCommas(statusData.keyLength)}`);
                console.log(`  Keys (tried).........: ${Util.numberWithCommas(statusData.keysTried)}`);
                console.log(`  Keys (total).........: ${Util.numberWithCommas(statusData.keysTotal)}`);
                console.log(`  Percentage...........: ${statusData.percentage}%`);
                console.log(`  Rate.................: ${statusData.rate.toFixed(2)} kHash/s}`);
                console.log(`  String...............: ${colors.cyan(statusData.string)}`);
            }
        });

        if (didSucceed) {
            dateDiff = currentDate - this.startDate;
            console.log('----------------------------------------------------------------------');
            console.log(`Started................: ${this.startDate.toUTCString()}`);
            console.log(`Ended..................: ${currentDate.toUTCString()}`);
            console.log(`The process took ${(dateDiff / 1000).toFixed(2)} seconds.`);
            console.log(`${this.match} : ${colors.green(secret)}`);
            process.exit(0);
        }
        this.lastDate = currentDate;
    }

    sendEvents(data) {
        let didSucceed = false,
            secret = '';

        this.status.set(data.workerId, data);

        this.status.forEach((statusData) => {
            if (statusData.hasOwnProperty('status')) {
                this.emit('progress', statusData);
            }
            if (statusData.success === true) {
                didSucceed = true;
                secret = statusData.string;
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