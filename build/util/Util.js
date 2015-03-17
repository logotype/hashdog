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

var Util = exports.Util = (function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, {
        numberWithCommas: {
            value: function numberWithCommas(x) {
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }
        },
        replaceCharAtIndex: {
            value: function replaceCharAtIndex(str, index, chr) {
                if (index > str.length - 1) {
                    return str;
                }
                return str.substr(0, index) + chr + str.substr(index + 1);
            }
        },
        cls: {
            value: function cls() {
                process.stdout.write("\u001b[2J\u001b[0;0f");
            }
        }
    });

    return Util;
})();