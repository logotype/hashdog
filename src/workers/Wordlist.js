/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2017 Victor Norgren
 * Released under the MIT license
 */
import {BaseWorker} from './BaseWorker';
import MD5 from 'md5-es';

export class Wordlist extends BaseWorker {
    constructor(options) {
        super(options);

        this.lastTries = 0;

        this.data.name = '<Dictionary> Words';
        this.data.processId = process.pid;
        this.data.status = 'Initializing...';
    }

    initialize(options) {

        let i = 0,
            wordArray = require('json!../../data/wordlist-english.json').data,
            currentString = '',
            currentStringLeet = '',
            hash = '',
            hashLeet = '',
            currentDate = null,
            dateDiff = 0,
            triesDiff = 0,
            percentage = 0,
            rate = 0;

        this.data.status = 'Loading dictionary';
        this.sendStatus();

        // If a password length is specified, filter the array
        if (options.length) {
            wordArray = wordArray.filter((element) => {
                return element.length === options.length;
            });
        }

        this.data.status = 'Working';
        this.sendStatus();

        for (i; i < wordArray.length; i++) {
            currentString = wordArray[i];
            currentStringLeet = currentString.replace(/i/g, '1').replace(/o/g, '0').replace(/e/g, '3');

            hash = MD5.hash(currentString);
            hashLeet = this.hasher.hash(currentStringLeet);

            if (this.match === hash || this.match === hashLeet) {

                this.data.status = 'SUCCESS';
                this.data.success = true;
                this.data.uptime = process.uptime().toFixed(2);
                this.data.keyLength = wordArray[i].length;
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

            currentDate = new Date();
            dateDiff = currentDate - this.lastDate;

            if (dateDiff >= this.refreshRate) {
                currentDate = new Date();
                dateDiff = currentDate - this.lastDate;
                triesDiff = i - this.lastTries;
                percentage = (i / wordArray.length * 100).toFixed(2);
                rate = triesDiff / (dateDiff / 1000) / 1000;

                this.data.status = 'Working';
                this.data.success = false;
                this.data.uptime = process.uptime().toFixed(2);
                this.data.keyLength = wordArray[i].length;
                this.data.keysTried = i;
                this.data.keysTotal = wordArray.length;
                this.data.rate = rate;
                this.data.percentage = percentage;
                this.data.string = currentString;
                this.sendStatus();
                this.lastTries = i;
                this.lastDate = currentDate;
            }
        }
        this.data.percentage = 100;
        this.data.uptime = process.uptime().toFixed(2);
        this.data.keyLength = wordArray[i - 1].length;
        this.data.keysTried = i;
        this.data.keysTotal = wordArray.length;
        this.data.status = 'Unsuccessful';
        this.data.string = '';
        this.sendStatus();
        process.send({command: 'DONE', workerId: this.data.workerId});
    }
}