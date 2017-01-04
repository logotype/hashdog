/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2017 Victor Norgren
 * Released under the MIT license
 */
export class Task {
    constructor(options) {
        this.command = 'setupWorker';
        this.workerId = 0;
        this.options = options || {};
    }
}