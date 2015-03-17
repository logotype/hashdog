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

        this.passwordArray = [];
        this.passwordLength = 0;
        this.lastTries = 0;

        this.data.name = "<Dictionary> Passwords";
        this.data.thread = "pl";
        this.data.status = "Initializing...";
    }

    _inherits(Passwords, _BaseWorker);

    _createClass(Passwords, {
        initialize: {
            value: function initialize(options) {
                var self = this,
                    fullPath = undefined,
                    fs = require("fs"),
                    path = require("path"),
                    join = require("path").join,
                    zlib = require("zlib"),
                    tar = require("tar");

                this.passwordLength = options.length;

                this.data.status = "Parsing password archive";
                this.data.uptime = process.uptime().toFixed(2);
                this.sendStatus();

                fs.createReadStream(join(__dirname, "../../data/data.tar.gz")).on("error", console.log).pipe(zlib.Unzip()).pipe(tar.Parse()).on("entry", function (entry) {
                    fullPath = join(__dirname, "../../data/data.bin");
                    self.data.status = "Extracting password list";
                    self.data.uptime = process.uptime().toFixed(2);
                    self.sendStatus();
                    entry.pipe(fs.createWriteStream(fullPath));
                    entry.on("end", function () {
                        self.processList(fullPath);
                    });
                });
            }
        },
        processList: {
            value: function processList(path) {
                var self = this,
                    fs = require("fs"),
                    liner = require("../util/Liner"),
                    source = fs.createReadStream(path);

                this.data.status = "Reading password list";
                this.data.uptime = process.uptime().toFixed(2);
                this.sendStatus();

                source.pipe(liner);
                source.on("end", function () {
                    console.log("deleting: " + path);
                    fs.unlinkSync(path);
                    self.passwordsByLengthProcess();
                });

                liner.on("readable", function () {
                    var line = undefined;
                    while ((line = liner.read()) !== null) {
                        self.passwordArray.push(line);
                    }
                });
            }
        },
        passwordsByLengthProcess: {
            value: function passwordsByLengthProcess() {
                var self = this,
                    i = 0,
                    currentString = undefined,
                    hash = undefined,
                    length = this.passwordArray.length,
                    currentDate = undefined,
                    dateDiff = undefined,
                    triesDiff = undefined,
                    percentage = undefined,
                    rate = undefined;

                this.data.status = "Filtering passwords by length";
                this.data.uptime = process.uptime().toFixed(2);
                this.sendStatus();

                // If a password length is specified, filter the array
                if (this.passwordLength) {
                    this.passwordArray = this.passwordArray.filter(function (element) {
                        return element.length === self.passwordLength;
                    });
                }

                this.data.status = "Working";
                this.data.uptime = process.uptime().toFixed(2);
                this.sendStatus();

                for (i; i < this.passwordArray.length; i++) {
                    currentString = this.passwordArray[i];
                    hash = this.hasher.hash(currentString);
                    if (this.match === hash) {
                        this.data.status = "SUCCESS";
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
                        percentage = (i / this.passwordArray.length * 100).toFixed(2);
                        rate = triesDiff * (1000 / dateDiff) / 1000;

                        this.data.status = "Working";
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
                this.data.status = "Unsuccessful";
                this.data.string = "";
                this.sendStatus();
                process.exit(0);
            }
        }
    });

    return Passwords;
})(BaseWorker);