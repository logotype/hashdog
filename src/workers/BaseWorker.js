/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2017 Victor Norgren
 * Released under the MIT license
 */
import MD5 from 'md5-es';
import SHA1 from 'sha1-es';
import SHA256 from 'sha256-es';
import SHA512 from 'sha512-es';
export class BaseWorker {
    constructor(options) {
        this.refreshRate = options.refreshRate;
        this.match = options.match;
        this.string = '';
        this.lastDate = new Date();
        this.data = {
            command: 'DISPLAY',
            name: 'BaseWorker',
            workerId: 0,
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

    initializeWorker(workerId) {
        this.data.workerId = workerId;
        this.data.processId = process.pid;
    }

    initialize() {
        throw new Error('Must override initialize!');
    }

    sendStatus() {
        process.send(this.data);
    }
}