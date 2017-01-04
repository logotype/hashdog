/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2017 Victor Norgren
 * Released under the MIT license
 */
import {BaseWorker} from './BaseWorker';

export class Passwords extends BaseWorker {
    constructor(options) {
        super(options);

        this.passwordLength = 0;
        this.lastTries = 0;

        this.data.name = '<Dictionary> Passwords';
        this.data.keysTried = 0;
        this.data.keysTotal = 14344391;
        this.data.processId = process.pid;
        this.data.status = 'Initializing...';
    }

    initialize(options) {
        const fs = require('fs'),
            join = require('path').join,
            zlib = require('zlib'),
            tar = require('tar'),
            fullPath = join(__dirname, '../../data/data.bin');

        let checkFile = null;

        this.passwordLength = options.length;

        this.data.status = 'Parsing password archive';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        checkFile = fs.createReadStream(join(__dirname, '../../data/data.bin'));
        checkFile.on('error', () => {
            fs.createReadStream(join(__dirname, '../../data/data.tar.gz'))
                .on('error', (error) => {
                    if (error.code === 'EACCES') {
                        this.data.status = 'Please run with sudo. Error when extracting data.';
                    } else {
                        this.data.status = error.toString();
                    }
                    this.data.uptime = process.uptime().toFixed(2);
                    this.sendStatus();
                    process.exit(0);
                })
                .pipe(zlib.Unzip())
                .pipe(tar.Parse())
                .on('entry', (entry) => {
                    this.data.status = 'Extracting password list';
                    this.data.uptime = process.uptime().toFixed(2);
                    this.sendStatus();
                    entry.pipe(fs.createWriteStream(fullPath));
                    entry.on('end', () => {
                        this.processList(fullPath);
                    });
                });
        });
        checkFile.on('readable', () => {
            this.data.status = 'Password list cached';
            this.processList(fullPath);
        });
    }

    processList(path) {
        const fs = require('fs'),
            liner = require('../util/Liner'),
            source = fs.createReadStream(path);

        this.data.status = 'Working';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        source.pipe(liner);
        source.on('end', () => {
            fs.unlinkSync(path);
            this.data.percentage = 100;
            this.data.uptime = process.uptime().toFixed(2);
            this.data.keyLength = 0;
            this.data.status = 'Unsuccessful';
            this.data.string = '';
            this.sendStatus();
            process.send({command: 'DONE', workerId: this.data.workerId});
        });

        liner.on('readable', () => {
            let line = null;
            while ((line = liner.read()) !== null) {
                this.processLine(line);
            }
        });
    }

    processLine(line) {
        let hash = '', currentDate = null, dateDiff = 0, triesDiff = 0, percentage = 0, rate = 0;

        // If a password length is specified, skip if not matching exactly
        if (this.passwordLength && line.length !== this.passwordLength) {
            return;
        }

        hash = this.hasher.hash(line);
        if (this.match === hash) {
            this.data.status = 'SUCCESS';
            this.data.success = true;
            this.data.uptime = process.uptime().toFixed(2);
            this.data.keyLength = line.length;
            this.data.hash = hash;
            this.data.string = line;
            this.sendStatus();
            process.exit(0);
            return;
        }

        currentDate = new Date();
        dateDiff = currentDate - this.lastDate;

        if (dateDiff >= this.refreshRate) {
            triesDiff = this.data.keysTried - this.lastTries;
            percentage = (this.data.keysTried / this.data.keysTotal * 100).toFixed(2);
            rate = triesDiff / (dateDiff / 1000) / 1000;

            this.data.status = 'Working';
            this.data.success = false;
            this.data.uptime = process.uptime().toFixed(2);
            this.data.keyLength = line.length;
            this.data.rate = rate;
            this.data.percentage = percentage;
            this.data.string = line;
            this.sendStatus();
            this.lastTries = this.data.keysTried;
            this.lastDate = currentDate;
        }
        this.data.keysTried++;
    }
}