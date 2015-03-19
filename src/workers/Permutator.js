/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {BaseWorker} from './BaseWorker';
import {Util} from './../util/Util';

export class Permutator extends BaseWorker {

    constructor(options) {
        super(options);

        this.permutations = 0;
        this.lastPermutations = 0;
        this.tryCompleteKeyspace = false;
        this.options = {};

        this.data.name = '<Bruteforce> Permutations';
        this.data.thread = 'sp';
        this.data.status = 'Initializing...';
    }

    initialize(options) {

        this.options = options;

        if(!this.options.length) {
            this.options.length = 2;
        } else if (this.options.length >= 16) {
            console.log('Exceeded maximum key length!');
            return;
        }

        // Reset data
        this.permutations = 0;
        this.lastPermutations = 0;
        this.string = '';
        this.data.keyLength = this.options.length;
        this.data.keysTotal = Math.pow(this.options.chars.length, this.options.length);

        for (let j = 0; j < this.options.length; j++) {
            this.string += ' ';
        }

        this.permute(this.options.length);
    }

    permute(n) {
        let j, hash, currentDate, dateDiff, permDiff, percentage, rate;

        if (n === 0) {
            if(parseInt(this.permutations) >= (parseInt(this.data.keysTotal) - 1)) {
                if(this.tryCompleteKeyspace) {
                    this.options.length++;
                    this.initialize(this.options);
                    return;
                } else {
                    this.data.status = 'Unsuccessful';
                    this.data.success = false;
                    this.data.uptime = process.uptime().toFixed(2);
                    this.data.keysTried = this.permutations + 1;
                    this.data.percentage = 100;
                    this.data.string = '';
                    this.sendStatus();
                    process.exit(0);
                }
            }

            hash = this.hasher.hash(this.string);

            if (hash === this.match) {
                this.data.status = 'SUCCESS';
                this.data.success = true;
                this.data.uptime = process.uptime();
                this.data.keysTried = this.permutations;
                this.data.hash = hash;
                this.data.string = this.string;
                this.sendStatus();
                process.exit(0);
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
            this.permutations++;
        } else {
            for (j = 0; j < this.options.chars.length; j++) {
                this.string = Util.replaceCharAtIndex(this.string, n - 1, this.options.chars[j]);
                this.permute(n - 1);
            }
        }
    }
}
