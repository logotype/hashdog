/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {BaseWorker} from './BaseWorker';
import {MD5} from './../util/MD5';
import {Util} from './../util/Util';

export class Permutator extends BaseWorker {

    constructor(options) {
        super(options);

        this.permutations = 0;
        this.foundMatch = false;
        this.lastPermutations = 0;

        this.data.name = '<Bruteforce> Permutations';
        this.data.thread = 'sp';
        this.data.status = 'Initializing...';
    }

    initialize(options) {
        this.data.keysTotal = Math.pow(options.chars.length, options.length);
        this.permute(options.length, options.chars);
    }

    permute(n, chars) {
        let j, hash, currentDate, dateDiff, permDiff, percentage, rate;

        if (this.foundMatch) {
            return;
        }

        if (!this.string || this.string.length === 0) {
            this.string = '';
            for (j = 0; j < n; j++) {
                this.string += ' ';
            }
        }

        if (n === 0) {
            hash = this.md5.hash(this.string);
            if (hash === this.match) {
                this.foundMatch = true;
                this.data.status = 'SUCCESS';
                this.data.success = true;
                this.data.uptime = process.uptime();
                this.data.keysTried = this.permutations;
                this.data.hash = hash;
                this.data.string = this.string;
                this.sendStatus();
                process.exit(0);
            } else {
                this.permutations++;
            }

            currentDate = new Date();
            dateDiff = currentDate - this.lastDate;

            if (dateDiff >= this.refreshRate) {
                permDiff = this.permutations - this.lastPermutations;
                percentage = ((this.permutations / this.data.keysTotal) * 100).toFixed(2);
                rate = permDiff * (1000 / dateDiff);

                this.data.status = 'Working';
                this.data.success = false;
                this.data.uptime = process.uptime().toFixed(2);
                this.data.keysTried = this.permutations;
                this.data.rate = (rate / 1000).toFixed(2);
                this.data.percentage = percentage;
                this.data.string = this.string;

                this.sendStatus();

                this.lastPermutations = this.permutations;
                this.lastDate = currentDate;
            }

        } else {
            for (j = 0; j < chars.length; j++) {
                this.string = Util.replaceCharAtIndex(this.string, n - 1, chars[j]);
                this.permute(n - 1, chars);
            }
        }
    }
}
