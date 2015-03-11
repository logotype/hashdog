/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {BaseWorker} from './BaseWorker';
import {MD5} from './../util/MD5';

export class Wordlist extends BaseWorker {

    constructor(options) {
        super(options);

        this.lastTries = 0;

        this.data.name = '<Dictionary> Words';
        this.data.thread = 'wl';
        this.data.status = 'Initializing...';
    }

    initialize(options) {

        let i = 0,
            wordArray, currentString, currentStringLeet, hash, hashLeet, currentDate, dateDiff, triesDiff, percentage, rate;

        this.data.status = 'Loading dictionary';
        this.sendStatus();
        wordArray = require('../data/wordlist-english.json').data;
        wordArray = wordArray.filter((element) => {
            return element.length === options.length;
        });

        this.data.status = 'Working';
        this.sendStatus();

        for (i; i < wordArray.length; i++) {
            currentString = wordArray[i];
            currentStringLeet = currentString.replace(/i/g, '1').replace(/o/g, '0').replace(/e/g, '3');

            hash = MD5.hash(currentString);
            hashLeet = MD5.hash(currentStringLeet);

            if (this.match === hash || this.match === hashLeet) {

                this.data.status = 'SUCCESS';
                this.data.success = true;
                this.data.uptime = process.uptime().toFixed(2);
                this.data.keysTried = i;
                this.data.hash = hash;

                if (this.match === hashLeet) {
                    this.data.string = currentStringLeet;
                } else {
                    this.data.string = currentString;
                }

                this.sendStatus();
                process.exit(0);
                break;
            }
            if (i > 0 && i % 100000 === 0) {

                currentDate = new Date();

                dateDiff = currentDate - this.lastDate;
                triesDiff = i - this.lastTries;
                percentage = ((i / wordArray.length) * 100).toFixed(2);
                rate = triesDiff * (1000 / dateDiff) / 1000;

                this.data.status = 'Working';
                this.data.success = false;
                this.data.uptime = process.uptime().toFixed(2);
                this.data.keysTried = i;
                this.data.keysTotal = wordArray.length;
                this.data.rate = rate.toFixed(2);
                this.data.percentage = percentage;
                this.data.string = currentString;

                this.sendStatus();

                this.lastTries = i;
                this.lastDate = currentDate;
            }
        }
        this.data.percentage = 100;
        this.data.uptime = process.uptime().toFixed(2);
        this.data.keysTried = i;
        this.data.keysTotal = wordArray.length;
        this.data.status = 'Unsuccessful';
        this.data.string = '';
        this.sendStatus();
        process.exit(0);
    }
}
