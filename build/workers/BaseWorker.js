"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var MD5 = require("./../hash/MD5").MD5;

var SHA1 = require("./../hash/SHA1").SHA1;

var SHA256 = require("./../hash/SHA256").SHA256;

var SHA512 = require("./../hash/SHA512").SHA512;

var BaseWorker = exports.BaseWorker = (function () {
    function BaseWorker(options) {
        _classCallCheck(this, BaseWorker);

        this.refreshRate = options.refreshRate;
        this.match = options.match;
        this.string = "";
        this.lastDate = new Date();
        this.data = {
            type: "display",
            name: "BaseWorker",
            thread: "bw",
            status: "",
            uptime: 0,
            success: false,
            percentage: 0,
            rate: 0,
            keyLength: 0,
            keysTried: 0,
            keysTotal: 0,
            expected: this.match,
            string: ""
        };

        switch (options.type.toUpperCase()) {
            case "MD5":
                this.hasher = MD5;
                break;
            case "SHA1":
                this.hasher = SHA1;
                break;
            case "SHA256":
                this.hasher = SHA256;
                break;
            case "SHA512":
                this.hasher = SHA512;
                break;
            default:
                throw new Error("Unsupported hash type");
        }
    }

    _createClass(BaseWorker, {
        initialize: {
            value: function initialize(options) {
                throw new Error("Must override initialize!");
            }
        },
        sendStatus: {
            value: function sendStatus() {
                process.send(this.data);
            }
        }
    });

    return BaseWorker;
})();