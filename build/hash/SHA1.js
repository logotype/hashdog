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
                var K = new Uint32Array([1518500249, 1859775393, 2400959708, 3395469782]);

                var H0 = 1732584193,
                    H1 = 4023233417,
                    H2 = 2562383102,
                    H3 = 271733878,
                    H4 = 3285377520,
                    M = [],
                    W = new Int32Array(80),
                    N = undefined,
                    i = undefined,
                    j = undefined,
                    s = undefined,
                    T = undefined,
                    a = H0,
                    b = H1,
                    c = H2,
                    d = H3,
                    e = H4;

                string += String.fromCharCode(128);
                N = Math.ceil((string.length / 4 + 2) / 16);

                for (i = 0; i < N; i++) {
                    M[i] = [];
                    for (j = 0; j < 16; j++) {
                        M[i][j] = string.charCodeAt(i * 64 + j * 4) << 24 | string.charCodeAt(i * 64 + j * 4 + 1) << 16 | string.charCodeAt(i * 64 + j * 4 + 2) << 8 | string.charCodeAt(i * 64 + j * 4 + 3);
                    }
                }

                M[N - 1][14] = (string.length - 1) * 8 / Math.pow(2, 32);
                M[N - 1][14] = Math.floor(M[N - 1][14]);
                M[N - 1][15] = (string.length - 1) * 8 & 4294967295;

                for (i = 0; i < N; i++) {

                    W = new Int32Array(80);
                    a = H0;
                    b = H1;
                    c = H2;
                    d = H3;
                    e = H4;

                    for (var t = 0; t < 80; t++) {
                        if (t < 16) {
                            W[t] = M[i][t];
                        } else {
                            W[t] = SHA1.ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
                        }

                        s = Math.floor(t / 20);
                        T = SHA1.ROTL(a, 5) + SHA1.f(s, b, c, d) + e + K[s] + W[t] & 4294967295;
                        e = d;
                        d = c;
                        c = SHA1.ROTL(b, 30);
                        b = a;
                        a = T;
                    }

                    H0 = H0 + a & 4294967295;
                    H1 = H1 + b & 4294967295;
                    H2 = H2 + c & 4294967295;
                    H3 = H3 + d & 4294967295;
                    H4 = H4 + e & 4294967295;
                }

                return SHA1.hex(H0) + SHA1.hex(H1) + SHA1.hex(H2) + SHA1.hex(H3) + SHA1.hex(H4);
            }
        },
        f: {
            value: function f(s, x, y, z) {
                switch (s) {
                    case 0:
                        return x & y ^ ~x & z;
                    case 1:
                        return x ^ y ^ z;
                    case 2:
                        return x & y ^ x & z ^ y & z;
                    case 3:
                        return x ^ y ^ z;
                }
            }
        },
        ROTL: {
            value: function ROTL(x, n) {
                return x << n | x >>> 32 - n;
            }
        },
        hex: {
            value: function hex(string) {
                var outputString = "",
                    v = undefined,
                    i = 7;
                for (i; i >= 0; i--) {
                    v = string >>> i * 4 & 15;
                    outputString += v.toString(16);
                }
                return outputString;
            }
        }
    });

    return SHA1;
})();