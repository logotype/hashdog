/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
import {BaseWorker} from './BaseWorker';

export class Passwords extends BaseWorker {

    constructor(options) {
        super(options);

        this.passwordArray = [];
        this.passwordLength = 0;
        this.lastTries = 0;

        this.data.name = '<Dictionary> Passwords';
        this.data.thread = 'pl';
        this.data.status = 'Initializing...';
    }

    initialize(options) {
        let self = this,
            fullPath,
            fs = require('fs'),
            path = require('path'),
            join = require('path').join,
            mkdirp = require('mkdirp'),
            zlib = require('zlib'),
            tar = require('tar');

        this.passwordLength = options.length;

        this.data.status = 'Parsing password archive';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        fs.createReadStream(join(__dirname, '../../data/data.tar.gz'))
            .on('error', console.log)
            .pipe(zlib.Unzip())
            .pipe(tar.Parse())
            .on('entry', (entry) => {
                fullPath = path.join('./build/tmp', entry.path);
                self.data.status = 'Extracting password list';
                self.data.uptime = process.uptime().toFixed(2);
                self.sendStatus();
                mkdirp(path.dirname(fullPath), (err) => {
                    if (err) {
                        throw err;
                    }
                    entry.pipe(fs.createWriteStream(fullPath));
                    entry.on('end', function() {
                        self.processList(fullPath);
                    });
                });
            });
    }

    processList(path) {
        let self = this,
            fs = require('fs'),
            liner = require('../util/Liner'),
            source = fs.createReadStream(path);

        this.data.status = 'Reading password list';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        source.pipe(liner);
        source.on('end', () => {
            self.passwordsByLengthProcess();
        });

        liner.on('readable', () => {
            let line;
            while ((line = liner.read()) !== null) {
                self.passwordArray.push(line);
            }
        });
    }

    passwordsByLengthProcess() {
        let self = this,
            i = 0,
            currentString, hash, length = this.passwordArray.length,
            currentDate, dateDiff, triesDiff, percentage, rate;

        this.data.status = 'Filtering passwords by length';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        // If a password length is specified, filter the array
        if(this.passwordLength) {
            this.passwordArray = this.passwordArray.filter((element) => {
                return element.length === self.passwordLength;
            });
        }

        this.data.status = 'Working';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        for (i; i < this.passwordArray.length; i++) {
            currentString = this.passwordArray[i];
            hash = this.hasher.hash(currentString);
            if (this.match === hash) {
                this.data.status = 'SUCCESS';
                this.data.success = true;
                this.data.uptime = process.uptime().toFixed(2);
                this.data.keyLength = this.passwordArray[i].length;
                this.data.keysTried = i;
                this.data.hash = hash;
                this.data.string = currentString;
                this.sendStatus();
                process.exit(0);
                break;
            }

            currentDate = new Date();
            dateDiff = currentDate - this.lastDate;

            if (dateDiff >= this.refreshRate) {
                triesDiff = i - this.lastTries;
                percentage = ((i / this.passwordArray.length) * 100).toFixed(2);
                rate = triesDiff * (1000 / dateDiff) / 1000;

                this.data.status = 'Working';
                this.data.success = false;
                this.data.uptime = process.uptime().toFixed(2);
                this.data.keyLength = this.passwordArray[i].length;
                this.data.keysTried = i;
                this.data.keysTotal = this.passwordArray.length;
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
        this.data.keyLength = this.passwordArray[i - 1].length;
        this.data.keysTried = i;
        this.data.keysTotal = this.passwordArray.length;
        this.data.status = 'Unsuccessful';
        this.data.string = '';
        this.sendStatus();
        process.exit(0);
    }
}
