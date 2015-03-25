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

        this.passwordLength = 0;
        this.lastTries = 0;

        this.data.name = '<Dictionary> Passwords';
        this.data.keysTried = 0;
        this.data.keysTotal = 14344391;
        this.data.processId = process.pid;
        this.data.status = 'Initializing...';
    }

    initialize(options) {
        let self = this,
            fs = require('fs'),
            path = require('path'),
            join = require('path').join,
            zlib = require('zlib'),
            tar = require('tar'),
            fullPath = join(__dirname, '../../data/data.bin'),
            checkFile;

        this.passwordLength = options.length;

        this.data.status = 'Parsing password archive';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        checkFile = fs.createReadStream(join(__dirname, '../../data/data.bin'));
        checkFile.on('error', function(error) {
            fs.createReadStream(join(__dirname, '../../data/data.tar.gz'))
                .on('error', (error) => {
                    if (error.code === 'EACCES') {
                        self.data.status = 'Please run with sudo. Error when extracting data.';
                    } else {
                        self.data.status = error.toString();
                    }
                    self.data.uptime = process.uptime().toFixed(2);
                    self.sendStatus();
                    process.exit(0);
                })
                .pipe(zlib.Unzip())
                .pipe(tar.Parse())
                .on('entry', (entry) => {
                    self.data.status = 'Extracting password list';
                    self.data.uptime = process.uptime().toFixed(2);
                    self.sendStatus();
                    entry.pipe(fs.createWriteStream(fullPath));
                    entry.on('end', function() {
                        self.processList(fullPath);
                    });
                });
        });
        checkFile.on('readable', function() {
            self.data.status = 'Password list cached';
            self.processList(fullPath);
        });
    }

    processList(path) {
        let self = this,
            fs = require('fs'),
            liner = require('../util/Liner'),
            source = fs.createReadStream(path);

        this.data.status = 'Working';
        this.data.uptime = process.uptime().toFixed(2);
        this.sendStatus();

        source.pipe(liner);
        source.on('end', () => {
            fs.unlinkSync(path);
            self.data.percentage = 100;
            self.data.uptime = process.uptime().toFixed(2);
            self.data.keyLength = 0;
            self.data.status = 'Unsuccessful';
            self.data.string = '';
            self.sendStatus();
            process.send({command: 'DONE', workerId: this.data.workerId});
        });

        liner.on('readable', () => {
            let line;
            while ((line = liner.read()) !== null) {
                self.processLine(line);
            }
        });
    }

    processLine(line) {
        let hash, currentDate, dateDiff, triesDiff, percentage, rate;

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
            percentage = ((this.data.keysTried / this.data.keysTotal) * 100).toFixed(2);
            rate = (triesDiff / (dateDiff / 1000)) / 1000;

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