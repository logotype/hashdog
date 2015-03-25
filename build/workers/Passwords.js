"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */

var BaseWorker = require("./BaseWorker").BaseWorker;

var Passwords = exports.Passwords = (function (_BaseWorker) {
    function Passwords(options) {
        _classCallCheck(this, Passwords);

        _get(Object.getPrototypeOf(Passwords.prototype), "constructor", this).call(this, options);

        this.passwordLength = 0;
        this.lastTries = 0;

        this.data.name = "<Dictionary> Passwords";
        this.data.keysTried = 0;
        this.data.keysTotal = 14344391;
        this.data.processId = process.pid;
        this.data.status = "Initializing...";
    }

    _inherits(Passwords, _BaseWorker);

    _createClass(Passwords, {
        initialize: {
            value: function initialize(options) {
                var self = this,
                    fs = require("fs"),
                    path = require("path"),
                    join = require("path").join,
                    zlib = require("zlib"),
                    tar = require("tar"),
                    fullPath = join(__dirname, "../../data/data.bin"),
                    checkFile = undefined;

                this.passwordLength = options.length;

                this.data.status = "Parsing password archive";
                this.data.uptime = process.uptime().toFixed(2);
                this.sendStatus();

                checkFile = fs.createReadStream(join(__dirname, "../../data/data.bin"));
                checkFile.on("error", function (error) {
                    fs.createReadStream(join(__dirname, "../../data/data.tar.gz")).on("error", function (error) {
                        if (error.code === "EACCES") {
                            self.data.status = "Please run with sudo. Error when extracting data.";
                        } else {
                            self.data.status = error.toString();
                        }
                        self.data.uptime = process.uptime().toFixed(2);
                        self.sendStatus();
                        process.exit(0);
                    }).pipe(zlib.Unzip()).pipe(tar.Parse()).on("entry", function (entry) {
                        self.data.status = "Extracting password list";
                        self.data.uptime = process.uptime().toFixed(2);
                        self.sendStatus();
                        entry.pipe(fs.createWriteStream(fullPath));
                        entry.on("end", function () {
                            self.processList(fullPath);
                        });
                    });
                });
                checkFile.on("readable", function () {
                    self.data.status = "Password list cached";
                    self.processList(fullPath);
                });
            }
        },
        processList: {
            value: function processList(path) {
                var _this = this;

                var self = this,
                    fs = require("fs"),
                    liner = require("../util/Liner"),
                    source = fs.createReadStream(path);

                this.data.status = "Working";
                this.data.uptime = process.uptime().toFixed(2);
                this.sendStatus();

                source.pipe(liner);
                source.on("end", function () {
                    fs.unlinkSync(path);
                    self.data.percentage = 100;
                    self.data.uptime = process.uptime().toFixed(2);
                    self.data.keyLength = 0;
                    self.data.status = "Unsuccessful";
                    self.data.string = "";
                    self.sendStatus();
                    process.send({ command: "DONE", workerId: _this.data.workerId });
                });

                liner.on("readable", function () {
                    var line = undefined;
                    while ((line = liner.read()) !== null) {
                        self.processLine(line);
                    }
                });
            }
        },
        processLine: {
            value: function processLine(line) {
                var hash = undefined,
                    currentDate = undefined,
                    dateDiff = undefined,
                    triesDiff = undefined,
                    percentage = undefined,
                    rate = undefined;

                // If a password length is specified, skip if not matching exactly
                if (this.passwordLength && line.length !== this.passwordLength) {
                    return;
                }

                hash = this.hasher.hash(line);
                if (this.match === hash) {
                    this.data.status = "SUCCESS";
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

                    this.data.status = "Working";
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
    });

    return Passwords;
})(BaseWorker);