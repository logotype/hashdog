"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var HashDog = exports.HashDog = (function () {
    function HashDog(options) {
        var _this = this;

        _classCallCheck(this, HashDog);

        var SHA1RegExp = /^[0-9a-f]{40}$/i;
        var SHA256RegExp = /^[0-9a-f]{64}$/i;
        var SHA512RegExp = /^[0-9a-f]{128}$/i;
        var MD5RegExp = /^[0-9a-f]{32}$/i;

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

        var self = this,
            worker = undefined,
            refreshRate = 500,
            cluster = require("cluster"),
            numCPUs = require("os").cpus().length;

        this.startDate = new Date();
        this.match = options.hash.toLowerCase();
        this.type = options.type;
        this.chars = options.chars || "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789";
        this.fixedLength = options.length;
        this.workers = [];
        this.status = {
            wl: {},
            pl: {},
            sp: {}
        };
        this.wordlist = new Wordlist({ match: this.match, type: this.type, refreshRate: refreshRate });
        this.passwords = new Passwords({ match: this.match, type: this.type, refreshRate: refreshRate });
        this.permutator = new Permutator({ match: this.match, type: this.type, refreshRate: refreshRate });

        if (cluster.isMaster) {
            for (var i = 0; i < numCPUs - 1; i++) {
                worker = cluster.fork();
                worker.on("message", function (data) {
                    if (data.type === "display") {
                        self.display(data);
                    }
                });
                this.workers.push(worker);
            }

            setTimeout(function () {
                for (var i = 0; i < self.workers.length; i++) {
                    self.workers[i].send({
                        thread: i + 1
                    });
                }
            }, 500);
        } else {
            process.on("message", function (msg) {
                if (msg.thread) {
                    switch (msg.thread) {
                        case 1:
                            self.wordlist.initialize({ length: _this.fixedLength });
                            break;
                        case 2:
                            self.passwords.initialize({ length: _this.fixedLength });
                            break;
                        case 3:
                            if (!_this.fixedLength) {
                                self.permutator.tryCompleteKeyspace = true;
                            }
                            self.permutator.initialize({ length: _this.fixedLength, chars: _this.chars });
                            break;
                    }
                }
            });
        }
    }

    _createClass(HashDog, {
        display: {
            value: function display(data) {
                var self = this,
                    endDate = undefined,
                    dateDiff = undefined,
                    didSucceed = false,
                    secret = "",
                    i = 1,
                    colors = require("colors/safe");

                this.status[data.thread] = data;

                if (this.status.wl.success === true) {
                    didSucceed = true;
                    secret = this.status.wl.string;
                } else if (this.status.pl.success === true) {
                    didSucceed = true;
                    secret = this.status.pl.string;
                } else if (this.status.sp.success === true) {
                    didSucceed = true;
                    secret = this.status.sp.string;
                }

                Util.cls();

                console.log("hashdog by @logotype. Copyright © 2015. Released under the MIT license.");
                console.log("Hash: " + colors.yellow(self.match) + " type: " + colors.magenta(self.type) + " characters: " + colors.cyan(self.chars));
                console.log("");

                Object.keys(self.status).forEach(function (key) {
                    if (self.status[key].hasOwnProperty("status")) {
                        console.log("THREAD " + i + ":");
                        console.log("  Worker...............: " + self.status[key].name);
                        console.log("  Status...............: " + colors.yellow(self.status[key].status));
                        console.log("  Success..............: " + self.status[key].success);
                        console.log("  Uptime...............: " + self.status[key].uptime + " seconds");
                        console.log("  Key length...........: " + Util.numberWithCommas(self.status[key].keyLength));
                        console.log("  Keys (tried).........: " + Util.numberWithCommas(self.status[key].keysTried));
                        console.log("  Keys (total).........: " + Util.numberWithCommas(self.status[key].keysTotal));
                        console.log("  Percentage...........: " + self.status[key].percentage + "%");
                        console.log("  Rate.................: " + self.status[key].rate + " kHash/s");
                        console.log("  String...............: " + colors.cyan(self.status[key].string));
                    }
                    i++;
                });

                if (didSucceed) {
                    endDate = new Date();
                    dateDiff = endDate - this.startDate;
                    console.log("----------------------------------------------------------------------");
                    console.log("Started................: " + this.startDate.toUTCString());
                    console.log("Ended..................: " + endDate.toUTCString());
                    console.log("The process took " + (dateDiff / 1000).toFixed(2) + " seconds.");
                    console.log(this.match + " : " + colors.green(secret));
                    process.exit(0);
                }
            }
        }
    });

    return HashDog;
})();

exports["default"] = HashDog;