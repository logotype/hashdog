/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {MD5} from './../util/MD5';

export class BaseWorker {
    constructor(options) {
        this.refreshRate = 500;
        this.md5 = new MD5();
        this.match = options.match;
        this.string = '';
        this.lastDate = new Date();
        this.data = {
            name: 'BaseWorker',
            thread: 'bw',
            status: '',
            uptime: 0,
            success: false,
            percentage: 0,
            rate: 0,
            keysTried: 0,
            keysTotal: 0,
            expected: this.match,
            string: ''
        };
    }

    initialize(options) {
        throw new Error('Must override initialize!');
    }

    sendStatus() {
        process.send(this.data);
    }
}