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

var MD5 = require("./../hash/MD5").MD5;

var Wordlist = exports.Wordlist = (function (_BaseWorker) {
    function Wordlist(options) {
        _classCallCheck(this, Wordlist);

        _get(Object.getPrototypeOf(Wordlist.prototype), "constructor", this).call(this, options);

        this.lastTries = 0;

        this.data.name = "<Dictionary> Words";
        this.data.thread = "wl";
        this.data.status = "Initializing...";
    }

    _inherits(Wordlist, _BaseWorker);

    _createClass(Wordlist, {
        initialize: {
            value: function initialize(options) {

                var i = 0,
                    wordArray = undefined,
                    currentString = undefined,
                    currentStringLeet = undefined,
                    hash = undefined,
                    hashLeet = undefined,
                    currentDate = undefined,
                    dateDiff = undefined,
                    triesDiff = undefined,
                    percentage = undefined,
                    rate = undefined;

                this.data.status = "Loading dictionary";
                this.sendStatus();
                wordArray = require("../../data/wordlist-english.json").data;

                // If a password length is specified, filter the array
                if (options.length) {
                    wordArray = wordArray.filter(function (element) {
                        return element.length === options.length;
                    });
                }

                this.data.status = "Working";
                this.sendStatus();

                for (i; i < wordArray.length; i++) {
                    currentString = wordArray[i];
                    currentStringLeet = currentString.replace(/i/g, "1").replace(/o/g, "0").replace(/e/g, "3");

                    hash = MD5.hash(currentString);
                    hashLeet = this.hasher.hash(currentStringLeet);

                    if (this.match === hash || this.match === hashLeet) {

                        this.data.status = "SUCCESS";
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
                    if (i > 0 && i % 100000 === 0) {
                        currentDate = new Date();
                        dateDiff = currentDate - this.lastDate;
                        triesDiff = i - this.lastTries;
                        percentage = (i / wordArray.length * 100).toFixed(2);
                        rate = triesDiff * (1000 / dateDiff) / 1000;

                        this.data.status = "Working";
                        this.data.success = false;
                        this.data.uptime = process.uptime().toFixed(2);
                        this.data.keyLength = wordArray[i].length;
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
                this.data.keyLength = wordArray[i - 1].length;
                this.data.keysTried = i;
                this.data.keysTotal = wordArray.length;
                this.data.status = "Unsuccessful";
                this.data.string = "";
                this.sendStatus();
                process.exit(0);
            }
        }
    });

    return Wordlist;
})(BaseWorker);