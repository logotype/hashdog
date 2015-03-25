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

var Util = require("./../util/Util").Util;

var Permutator = exports.Permutator = (function (_BaseWorker) {
    function Permutator(options) {
        _classCallCheck(this, Permutator);

        _get(Object.getPrototypeOf(Permutator.prototype), "constructor", this).call(this, options);

        this.permutations = 0;
        this.lastPermutations = 0;
        this.options = {};
        this.currentMaxLength = 0;

        this.data.name = "<Bruteforce> Permutations";
        this.data.processId = process.pid;
        this.data.status = "Initializing...";
    }

    _inherits(Permutator, _BaseWorker);

    _createClass(Permutator, {
        initialize: {
            value: function initialize(options) {

                this.options = options;

                if (!this.options.length) {
                    this.options.length = 2;
                } else if (this.options.length >= 16) {
                    console.log("Exceeded maximum key length!");
                    return;
                }

                // Reset data
                this.permutations = 0;
                this.lastPermutations = 0;
                this.string = "";
                this.data.keyLength = this.options.length;
                this.data.keysTotal = Math.pow(this.options.chars.length, this.options.length);

                for (var j = 0; j < this.options.length; j++) {
                    this.string += " ";
                }

                this.permute(this.options.length);
            }
        },
        permute: {
            value: function permute(n) {
                var j = undefined,
                    hash = undefined,
                    currentDate = undefined,
                    dateDiff = undefined,
                    permDiff = undefined,
                    percentage = undefined,
                    rate = undefined;

                if (n === 0) {
                    if (parseInt(this.permutations) >= parseInt(this.data.keysTotal) - 1) {
                        this.data.status = "Unsuccessful";
                        this.data.success = false;
                        this.data.uptime = process.uptime().toFixed(2);
                        this.data.keysTried = this.permutations + 1;
                        this.data.percentage = 100;
                        this.data.string = "";
                        this.sendStatus();
                        process.send({ command: "DONE", workerId: this.data.workerId });
                    }

                    hash = this.hasher.hash(this.string);

                    if (hash === this.match) {
                        this.data.status = "SUCCESS";
                        this.data.success = true;
                        this.data.uptime = process.uptime();
                        this.data.keysTried = this.permutations;
                        this.data.hash = hash;
                        this.data.string = this.string;
                        this.sendStatus();
                        process.exit(0);
                    }

                    currentDate = new Date();
                    dateDiff = currentDate - this.lastDate;

                    if (dateDiff >= this.refreshRate) {
                        permDiff = this.permutations - this.lastPermutations;
                        percentage = (this.permutations / this.data.keysTotal * 100).toFixed(2);
                        rate = permDiff * (1000 / dateDiff);

                        this.data.status = "Working";
                        this.data.success = false;
                        this.data.uptime = process.uptime().toFixed(2);
                        this.data.keysTried = this.permutations;
                        this.data.rate = rate / 1000;
                        this.data.percentage = percentage;
                        this.data.string = this.string;
                        this.sendStatus();
                        this.lastPermutations = this.permutations;
                        this.lastDate = currentDate;
                    }
                    this.permutations++;
                } else {
                    for (j = 0; j < this.options.chars.length; j++) {
                        this.string = Util.replaceCharAtIndex(this.string, n - 1, this.options.chars[j]);
                        this.permute(n - 1);
                    }
                }
            }
        }
    });

    return Permutator;
})(BaseWorker);