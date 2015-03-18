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

var SHA1 = exports.SHA1 = (function () {
    function SHA1() {
        _classCallCheck(this, SHA1);
    }

    _createClass(SHA1, null, {
        hash: {
            value: function hash(string) {
                return SHA1.stringToHex(SHA1.arrayToString(SHA1.run(SHA1.stringToArray(string), string.length * 8)));
            }
        },
        run: {
            value: function run(input, len) {
                var i = undefined,
                    j = undefined,
                    t = undefined,
                    w = Array(80),
                    H0 = 1732584193,
                    H1 = -271733879,
                    H2 = -1732584194,
                    H3 = 271733878,
                    H4 = -1009589776,
                    a = H0,
                    b = H1,
                    c = H2,
                    d = H3,
                    e = H4;

                input[len >> 5] |= 128 << 24 - len % 32;
                input[(len + 64 >> 9 << 4) + 15] = len;

                for (i = 0; i < input.length; i += 16) {
                    H0 = a;
                    H1 = b;
                    H2 = c;
                    H3 = d;
                    H4 = e;

                    for (j = 0; j < 80; j += 1) {
                        if (j < 16) {
                            w[j] = input[i + j];
                        } else {
                            w[j] = SHA1.rotl(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                        }
                        t = SHA1.add(SHA1.add(SHA1.rotl(a, 5), SHA1.chMajPty(j, b, c, d)), SHA1.add(SHA1.add(e, w[j]), SHA1.cnst(j)));
                        e = d;
                        d = c;
                        c = SHA1.rotl(b, 30);
                        b = a;
                        a = t;
                    }

                    a = SHA1.add(a, H0);
                    b = SHA1.add(b, H1);
                    c = SHA1.add(c, H2);
                    d = SHA1.add(d, H3);
                    e = SHA1.add(e, H4);
                }
                return Array(a, b, c, d, e);
            }
        },
        arrayToString: {
            value: function arrayToString(input) {
                var i = undefined,
                    l = input.length * 32,
                    output = "";
                for (i = 0; i < l; i += 8) {
                    output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 255);
                }
                return output;
            }
        },
        stringToArray: {
            value: function stringToArray(input) {
                var i = undefined,
                    l = input.length * 8,
                    output = Array(input.length >> 2),
                    lo = output.length;
                for (i = 0; i < lo; i += 1) {
                    output[i] = 0;
                }
                for (i = 0; i < l; i += 8) {
                    output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << 24 - i % 32;
                }
                return output;
            }
        },
        stringToHex: {
            value: function stringToHex(input) {
                var hex_tab = "0123456789abcdef",
                    output = "",
                    x = undefined,
                    i = 0,
                    l = input.length;
                for (; i < l; i += 1) {
                    x = input.charCodeAt(i);
                    output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15);
                }
                return output;
            }
        },
        chMajPty: {
            value: function chMajPty(t, b, c, d) {
                if (t < 20) {
                    return b & c | ~b & d;
                }
                if (t < 40) {
                    return b ^ c ^ d;
                }
                if (t < 60) {
                    return b & c | b & d | c & d;
                }
                return b ^ c ^ d;
            }
        },
        cnst: {
            value: function cnst(t) {
                return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
            }
        },
        rotl: {
            value: function rotl(x, n) {
                return x << n | x >>> 32 - n;
            }
        },
        add: {
            value: function add(x, y) {
                var lsw = (x & 65535) + (y & 65535),
                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return msw << 16 | lsw & 65535;
            }
        }
    });

    return SHA1;
})();