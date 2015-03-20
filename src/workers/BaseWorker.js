/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {MD5} from './../hash/MD5';
import {SHA1} from './../hash/SHA1';
import {SHA256} from './../hash/SHA256';
import {SHA512} from './../hash/SHA512';
export class BaseWorker {
    constructor(options) {
        this.refreshRate = options.refreshRate;
        this.match = options.match;
        this.string = '';
        this.lastDate = new Date();
        this.data = {
            type: 'display',
            name: 'BaseWorker',
            thread: 'bw',
            status: '',
            uptime: 0,
            success: false,
            percentage: 0,
            rate: 0,
            keyLength: 0,
            keysTried: 0,
            keysTotal: 0,
            expected: this.match,
            string: ''
        };

        switch (options.type.toUpperCase()) {
            case 'MD5':
                this.hasher = MD5;
                break;
            case 'SHA1':
                this.hasher = SHA1;
                break;
            case 'SHA256':
                this.hasher = SHA256;
                break;
            case 'SHA512':
                this.hasher = SHA512;
                break;
            default:
                throw new Error('Unsupported hash type');
        }
    }

    initialize(options) {
        throw new Error('Must override initialize!');
    }

    sendStatus() {
        process.send(this.data);
    }
}