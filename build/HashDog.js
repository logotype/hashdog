"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */

var Permutator = require("./workers/Permutator").Permutator;

var Wordlist = require("./workers/Wordlist").Wordlist;

var Passwords = require("./workers/Passwords").Passwords;

var Util = require("./util/Util").Util;

var Task = require("./queue/Task").Task;

var EventEmitter = require("events").EventEmitter;

var HashDog = exports.HashDog = (function (_EventEmitter) {
    function HashDog(options) {
        var _this = this;

        _classCallCheck(this, HashDog);

        var SHA1RegExp = /^[0-9a-f]{40}$/i;
        var SHA256RegExp = /^[0-9a-f]{64}$/i;
        var SHA512RegExp = /^[0-9a-f]{128}$/i;
        var MD5RegExp = /^[0-9a-f]{32}$/i;

        var i = 0,
            len = undefined,
            task = undefined,
            numCPUs = require("os").cpus().length;

        if (!options || !options.hash) {
            throw new Error("Missing options!");
        } else if (!options.hash) {
            throw new Error("Missing hash!");
        } else if (!options.type) {
            if (MD5RegExp.test(options.hash)) {
                options.type = "MD5";
            } else if (SHA1RegExp.test(options.hash)) {
                options.type = "SHA1";
            } else if (SHA256RegExp.test(options.hash)) {
                options.type = "SHA256";
            } else if (SHA512RegExp.test(options.hash)) {
                options.type = "SHA512";
            } else {
                throw new Error("Please specify hash type!");
            }
        }

        switch (options.type) {
            case "MD5":
                if (!MD5RegExp.test(options.hash)) {
                    throw new Error("Invalid MD5 hash!");
                }
                break;
            case "SHA1":
                if (!SHA1RegExp.test(options.hash)) {
                    throw new Error("Invalid SHA1 hash!");
                }
                break;
            case "SHA256":
                if (!SHA256RegExp.test(options.hash)) {
                    throw new Error("Invalid SHA256 hash!");
                }
                break;
            case "SHA512":
                if (!SHA512RegExp.test(options.hash)) {
                    throw new Error("Invalid SHA512 hash!");
                }
                break;
        }

        if (options && options.environment === "CLI") {
            this.environment = "CLI";
        } else {
            this.environment = "LIB";
        }

        this.cluster = require("cluster");
        this.refreshRate = 500;
        this.startDate = new Date();
        this.match = options.hash.toLowerCase();
        this.type = options.type;
        this.chars = options.chars || "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789";
        this.fixedLength = options.length;
        this.workers = new Map();
        this.status = new Map();
        this.lastDate = new Date();
        this.wordlist = new Wordlist({ match: this.match, type: this.type, refreshRate: this.refreshRate });
        this.passwords = new Passwords({ match: this.match, type: this.type, refreshRate: this.refreshRate });
        this.permutator = new Permutator({ match: this.match, type: this.type, refreshRate: this.refreshRate });

        if (this.cluster.isMaster) {

            // Setup default workers
            task = new Task({ type: "WORDLIST" });
            this.addWorker(task);

            task = new Task({ type: "PASSWORD" });
            this.addWorker(task);

            if (this.fixedLength) {
                task = new Task({ type: "PERMUTATOR", length: this.fixedLength });
                this.addWorker(task);
            } else {
                len = Math.abs(numCPUs - this.workers.size);
                for (i = 0; i < len; i++) {
                    this.permutator.currentMaxLength++;
                    task = new Task({ type: "PERMUTATOR", length: this.permutator.currentMaxLength });
                    this.addWorker(task);
                }
            }
        } else if (this.cluster.isWorker) {
            process.on("message", function (data) {
                _this.messageHandler(data);
            });
        }
    }

    _inherits(HashDog, _EventEmitter);

    _createClass(HashDog, {
        addWorker: {
            value: function addWorker(task) {
                var _this = this;

                var worker = this.cluster.fork();
                task.workerId = worker.id;
                worker.on("message", function (data) {
                    _this.messageHandler(data);
                });
                this.workers.set(worker.id.toString(), task);
                worker.send(task);
            }
        },
        deleteWorker: {
            value: function deleteWorker(workerId) {
                this.cluster.workers[workerId].kill();
                this.cluster.workers[workerId].removeAllListeners("message");
                this.workers["delete"](workerId);
                this.status["delete"](workerId);
            }
        },
        messageHandler: {
            value: function messageHandler(data) {
                if (this.cluster.isMaster) {
                    if (data.hasOwnProperty("command")) {
                        switch (data.command) {
                            case "DISPLAY":
                                if (this.environment === "CLI") {
                                    this.display(data);
                                } else if (this.environment === "LIB") {
                                    this.sendEvents(data);
                                }
                                break;
                            case "DONE":
                                this.deleteWorker(data.workerId);
                                this.permutator.currentMaxLength++;
                                var task = new Task({
                                    type: "PERMUTATOR",
                                    length: this.permutator.currentMaxLength
                                });
                                this.addWorker(task);
                                break;
                        }
                    }
                } else if (this.cluster.isWorker) {
                    if (data.hasOwnProperty("command")) {
                        if (data.command === "setupWorker") {
                            switch (data.options.type) {
                                case "WORDLIST":
                                    this.wordlist.initializeWorker(data.workerId);
                                    this.wordlist.initialize({
                                        length: this.fixedLength
                                    });
                                    break;
                                case "PASSWORD":
                                    this.passwords.initializeWorker(data.workerId);
                                    this.passwords.initialize({
                                        length: this.fixedLength
                                    });
                                    break;
                                case "PERMUTATOR":
                                    this.permutator.initializeWorker(data.workerId);
                                    this.permutator.initialize({
                                        length: data.options.length,
                                        chars: this.chars
                                    });
                                    break;
                            }
                        }
                    }
                }
            }
        },
        display: {
            value: function display(data) {
                var currentDate = new Date(),
                    dateDiff = undefined,
                    didSucceed = false,
                    secret = "",
                    i = 1,
                    totalRate = 0,
                    colors = require("colors/safe");

                this.status.set(data.workerId, data);

                dateDiff = currentDate - this.lastDate;

                if (dateDiff <= this.refreshRate) {
                    return;
                }

                Util.cls();

                this.status.forEach(function (data) {
                    if (data.hasOwnProperty("status") && (data.status === "Working" || data.status === "SUCCESS")) {
                        totalRate += data.rate;
                    }
                    if (data.success === true) {
                        didSucceed = true;
                        secret = data.string;
                    }
                });

                console.log("hashdog by @logotype. Copyright © 2015. Released under the MIT license.");
                console.log("Hash: " + colors.yellow(this.match) + " type: " + colors.magenta(this.type) + " characters: " + colors.cyan(this.chars));
                console.log("Current rate combined..: " + totalRate.toFixed(2) + " kHash/s");
                console.log("");

                this.status.forEach(function (data) {
                    if (data.hasOwnProperty("status")) {
                        console.log("PROCESS " + data.workerId + ": " + data.name);
                        console.log("  Status...............: " + colors.yellow(data.status));
                        console.log("  Uptime...............: " + data.uptime + " seconds");
                        console.log("  Key length...........: " + Util.numberWithCommas(data.keyLength));
                        console.log("  Keys (tried).........: " + Util.numberWithCommas(data.keysTried));
                        console.log("  Keys (total).........: " + Util.numberWithCommas(data.keysTotal));
                        console.log("  Percentage...........: " + data.percentage + "%");
                        console.log("  Rate.................: " + data.rate.toFixed(2) + " kHash/s");
                        console.log("  String...............: " + colors.cyan(data.string));
                    }
                    i++;
                });

                if (didSucceed) {
                    dateDiff = currentDate - this.startDate;
                    console.log("----------------------------------------------------------------------");
                    console.log("Started................: " + this.startDate.toUTCString());
                    console.log("Ended..................: " + currentDate.toUTCString());
                    console.log("The process took " + (dateDiff / 1000).toFixed(2) + " seconds.");
                    console.log(this.match + " : " + colors.green(secret));
                    process.exit(0);
                }
                this.lastDate = currentDate;
            }
        },
        sendEvents: {
            value: function sendEvents(data) {
                var _this = this;

                var didSucceed = false,
                    secret = "";

                this.status.set(data.workerId, data);

                this.status.forEach(function (data) {
                    if (data.hasOwnProperty("status")) {
                        _this.emit("progress", data);
                    }
                    if (data.success === true) {
                        didSucceed = true;
                        secret = data.string;
                    }
                });

                if (didSucceed) {
                    this.emit("success", {
                        hash: this.match,
                        string: secret
                    });
                    process.exit(0);
                }
            }
        }
    });

    return HashDog;
})(EventEmitter);

exports["default"] = HashDog;