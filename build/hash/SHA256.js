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

var SHA256 = exports.SHA256 = (function () {
    function SHA256() {
        _classCallCheck(this, SHA256);
    }

    _createClass(SHA256, null, {
        hash: {
            value: function hash(string) {
                var K = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);

                var H0 = 1779033703,
                    H1 = 3144134277,
                    H2 = 1013904242,
                    H3 = 2773480762,
                    H4 = 1359893119,
                    H5 = 2600822924,
                    H6 = 528734635,
                    H7 = 1541459225,
                    M = [],
                    W = new Int32Array(64),
                    N = undefined,
                    i = undefined,
                    j = undefined,
                    T1 = undefined,
                    T2 = undefined,
                    a = H0,
                    b = H1,
                    c = H2,
                    d = H3,
                    e = H4,
                    f = H5,
                    g = H6,
                    h = H7;

                string += String.fromCharCode(128);
                N = Math.ceil((string.length / 4 + 2) / 16);

                for (i = 0; i < N; i++) {
                    M[i] = new Int32Array(16);
                    for (j = 0; j < 16; j++) {
                        M[i][j] = string.charCodeAt(i * 64 + j * 4) << 24 | string.charCodeAt(i * 64 + j * 4 + 1) << 16 | string.charCodeAt(i * 64 + j * 4 + 2) << 8 | string.charCodeAt(i * 64 + j * 4 + 3);
                    }
                }

                M[N - 1][14] = (string.length - 1) * 8 / Math.pow(2, 32);
                M[N - 1][14] = Math.floor(M[N - 1][14]);
                M[N - 1][15] = (string.length - 1) * 8 & 4294967295;

                for (i = 0; i < N; i++) {

                    W = new Int32Array(64);
                    a = H0;
                    b = H1;
                    c = H2;
                    d = H3;
                    e = H4;
                    f = H5;
                    g = H6;
                    h = H7;

                    for (var t = 0; t < 64; t++) {
                        if (t < 16) {
                            W[t] = M[i][t];
                        } else {
                            W[t] = SHA256.sigma1(W[t - 2]) + W[t - 7] + SHA256.sigma0(W[t - 15]) + W[t - 16] & 4294967295;
                        }

                        T1 = h + SHA256.gamma1(e) + SHA256.add4(e, f, g) + K[t] + W[t];
                        T2 = SHA256.gamma0(a) + SHA256.add5(a, b, c);
                        h = g;
                        g = f;
                        f = e;
                        e = d + T1 & 4294967295;
                        d = c;
                        c = b;
                        b = a;
                        a = T1 + T2 & 4294967295;
                    }

                    H0 = H0 + a & 4294967295;
                    H1 = H1 + b & 4294967295;
                    H2 = H2 + c & 4294967295;
                    H3 = H3 + d & 4294967295;
                    H4 = H4 + e & 4294967295;
                    H5 = H5 + f & 4294967295;
                    H6 = H6 + g & 4294967295;
                    H7 = H7 + h & 4294967295;
                }

                return SHA256.hex(H0) + SHA256.hex(H1) + SHA256.hex(H2) + SHA256.hex(H3) + SHA256.hex(H4) + SHA256.hex(H5) + SHA256.hex(H6) + SHA256.hex(H7);
            }
        },
        gamma0: {
            value: function gamma0(x) {
                return SHA256.ROTR(2, x) ^ SHA256.ROTR(13, x) ^ SHA256.ROTR(22, x);
            }
        },
        gamma1: {
            value: function gamma1(x) {
                return SHA256.ROTR(6, x) ^ SHA256.ROTR(11, x) ^ SHA256.ROTR(25, x);
            }
        },
        sigma0: {
            value: function sigma0(x) {
                return SHA256.ROTR(7, x) ^ SHA256.ROTR(18, x) ^ x >>> 3;
            }
        },
        sigma1: {
            value: function sigma1(x) {
                return SHA256.ROTR(17, x) ^ SHA256.ROTR(19, x) ^ x >>> 10;
            }
        },
        add4: {
            value: function add4(x, y, z) {
                return x & y ^ ~x & z;
            }
        },
        add5: {
            value: function add5(x, y, z) {
                return x & y ^ x & z ^ y & z;
            }
        },
        ROTR: {
            value: function ROTR(n, x) {
                return x >>> n | x << 32 - n;
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

    return SHA256;
})();