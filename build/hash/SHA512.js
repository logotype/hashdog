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

var SHA512 = exports.SHA512 = (function () {
    function SHA512() {
        _classCallCheck(this, SHA512);
    }

    _createClass(SHA512, null, {
        hash: {
            value: function hash(string) {
                var KH = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298, 3391569614, 3515267271, 3940187606, 4118630271, 116418474, 174292421, 289380356, 460393269, 685471733, 852142971, 1017036298, 1126000580, 1288033470, 1501505948, 1607167915, 1816402316]);
                var KL = new Uint32Array([3609767458, 602891725, 3964484399, 2173295548, 4081628472, 3053834265, 2937671579, 3664609560, 2734883394, 1164996542, 1323610764, 3590304994, 4068182383, 991336113, 633803317, 3479774868, 2666613458, 944711139, 2341262773, 2007800933, 1495990901, 1856431235, 3175218132, 2198950837, 3999719339, 766784016, 2566594879, 3203337956, 1034457026, 2466948901, 3758326383, 168717936, 1188179964, 1546045734, 1522805485, 2643833823, 2343527390, 1014477480, 1206759142, 344077627, 1290863460, 3158454273, 3505952657, 106217008, 3606008344, 1432725776, 1467031594, 851169720, 3100823752, 1363258195, 3750685593, 3785050280, 3318307427, 3812723403, 2003034995, 3602036899, 1575990012, 1125592928, 2716904306, 442776044, 593698344, 3733110249, 2999351573, 3815920427, 3928383900, 566280711, 3454069534, 4000239992, 1914138554, 2731055270, 3203993006, 320620315, 587496836, 1086792851, 365543100, 2618297676, 3409855158, 4234509866, 987167468, 1246189591]);

                var H = [{ high: 1779033703, low: 4089235720 }, { high: 3144134277, low: 2227873595 }, { high: 1013904242, low: 4271175723 }, { high: 2773480762, low: 1595750129 }, { high: 1359893119, low: 2917565137 }, { high: 2600822924, low: 725511199 }, { high: 528734635, low: 4215389547 }, { high: 1541459225, low: 327033209 }],
                    W = [],
                    a = undefined,
                    b = undefined,
                    c = undefined,
                    d = undefined,
                    e = undefined,
                    f = undefined,
                    g = undefined,
                    h = undefined,
                    i = undefined,
                    N = undefined,
                    T1 = undefined,
                    T2 = undefined,
                    stringLength = string.length * 8,
                    stringArray = new Int32Array(32);

                for (i = 0; i < stringLength; i += 8) {
                    stringArray[i >> 5] |= (string.charCodeAt(i / 8) & (1 << 8) - 1) << 32 - 8 - i % 32;
                }

                stringArray[stringLength >> 5] |= 128 << 24 - stringLength % 32;
                stringArray[(stringLength + 128 >> 10 << 5) + 31] = stringLength;
                string = stringArray;
                N = string.length;

                for (i = 0; i < N; i += 32) {
                    W = [];
                    a = H[0];
                    b = H[1];
                    c = H[2];
                    d = H[3];
                    e = H[4];
                    f = H[5];
                    g = H[6];
                    h = H[7];

                    for (var t = 0; t < 80; t++) {
                        if (t < 16) {
                            W[t] = {
                                high: string[t * 2 + i],
                                low: string[t * 2 + i + 1]
                            };
                        } else {
                            W[t] = SHA512.add4(SHA512.gamma1(W[t - 2]), W[t - 7], SHA512.gamma0(W[t - 15]), W[t - 16]);
                        }

                        T1 = SHA512.add5(h, SHA512.sigma1(e), SHA512.ch(e, f, g), KH[t], KL[t], W[t]);
                        T2 = SHA512.add2(SHA512.sigma0(a), SHA512.maj(a, b, c));
                        h = g;
                        g = f;
                        f = e;
                        e = SHA512.add2(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = SHA512.add2(T1, T2);
                    }

                    H[0] = SHA512.add2(a, H[0]);
                    H[1] = SHA512.add2(b, H[1]);
                    H[2] = SHA512.add2(c, H[2]);
                    H[3] = SHA512.add2(d, H[3]);
                    H[4] = SHA512.add2(e, H[4]);
                    H[5] = SHA512.add2(f, H[5]);
                    H[6] = SHA512.add2(g, H[6]);
                    H[7] = SHA512.add2(h, H[7]);
                }

                return SHA512.hex(H[0].high) + SHA512.hex(H[0].low) + SHA512.hex(H[1].high) + SHA512.hex(H[1].low) + SHA512.hex(H[2].high) + SHA512.hex(H[2].low) + SHA512.hex(H[3].high) + SHA512.hex(H[3].low) + SHA512.hex(H[4].high) + SHA512.hex(H[4].low) + SHA512.hex(H[5].high) + SHA512.hex(H[5].low) + SHA512.hex(H[6].high) + SHA512.hex(H[6].low) + SHA512.hex(H[7].high) + SHA512.hex(H[7].low);
            }
        },
        add2: {
            value: function add2(x, y) {
                var lsw = undefined,
                    msw = undefined,
                    low = undefined,
                    high = undefined;

                lsw = (x.low & 65535) + (y.low & 65535);
                msw = (x.low >>> 16) + (y.low >>> 16) + (lsw >>> 16);
                low = (msw & 65535) << 16 | lsw & 65535;

                lsw = (x.high & 65535) + (y.high & 65535) + (msw >>> 16);
                msw = (x.high >>> 16) + (y.high >>> 16) + (lsw >>> 16);
                high = (msw & 65535) << 16 | lsw & 65535;

                return {
                    high: high,
                    low: low
                };
            }
        },
        add4: {
            value: function add4(a, b, c, d) {
                var lsw = undefined,
                    msw = undefined,
                    low = undefined,
                    high = undefined;

                lsw = (a.low & 65535) + (b.low & 65535) + (c.low & 65535) + (d.low & 65535);
                msw = (a.low >>> 16) + (b.low >>> 16) + (c.low >>> 16) + (d.low >>> 16) + (lsw >>> 16);
                low = (msw & 65535) << 16 | lsw & 65535;

                lsw = (a.high & 65535) + (b.high & 65535) + (c.high & 65535) + (d.high & 65535) + (msw >>> 16);
                msw = (a.high >>> 16) + (b.high >>> 16) + (c.high >>> 16) + (d.high >>> 16) + (lsw >>> 16);
                high = (msw & 65535) << 16 | lsw & 65535;

                return {
                    high: high,
                    low: low
                };
            }
        },
        add5: {
            value: function add5(a, b, c, dHigh, dLow, e) {
                var lsw = undefined,
                    msw = undefined,
                    low = undefined,
                    high = undefined;

                lsw = (a.low & 65535) + (b.low & 65535) + (c.low & 65535) + (dLow & 65535) + (e.low & 65535);
                msw = (a.low >>> 16) + (b.low >>> 16) + (c.low >>> 16) + (dLow >>> 16) + (e.low >>> 16) + (lsw >>> 16);
                low = (msw & 65535) << 16 | lsw & 65535;

                lsw = (a.high & 65535) + (b.high & 65535) + (c.high & 65535) + (dHigh & 65535) + (e.high & 65535) + (msw >>> 16);
                msw = (a.high >>> 16) + (b.high >>> 16) + (c.high >>> 16) + (dHigh >>> 16) + (e.high >>> 16) + (lsw >>> 16);
                high = (msw & 65535) << 16 | lsw & 65535;

                return {
                    high: high,
                    low: low
                };
            }
        },
        maj: {
            value: function maj(x, y, z) {
                return {
                    high: x.high & y.high ^ x.high & z.high ^ y.high & z.high,
                    low: x.low & y.low ^ x.low & z.low ^ y.low & z.low
                };
            }
        },
        ch: {
            value: function ch(x, y, z) {
                return {
                    high: x.high & y.high ^ ~x.high & z.high,
                    low: x.low & y.low ^ ~x.low & z.low
                };
            }
        },
        sigma0: {
            value: function sigma0(x) {
                var ROTR28 = SHA512.ROTR(x, 28);
                var ROTR34 = SHA512.ROTR(x, 34);
                var ROTR39 = SHA512.ROTR(x, 39);

                return {
                    high: ROTR28.high ^ ROTR34.high ^ ROTR39.high,
                    low: ROTR28.low ^ ROTR34.low ^ ROTR39.low
                };
            }
        },
        sigma1: {
            value: function sigma1(x) {
                var ROTR14 = SHA512.ROTR(x, 14);
                var ROTR18 = SHA512.ROTR(x, 18);
                var ROTR41 = SHA512.ROTR(x, 41);

                return {
                    high: ROTR14.high ^ ROTR18.high ^ ROTR41.high,
                    low: ROTR14.low ^ ROTR18.low ^ ROTR41.low
                };
            }
        },
        gamma0: {
            value: function gamma0(x) {
                var ROTR1 = SHA512.ROTR(x, 1),
                    ROTR8 = SHA512.ROTR(x, 8),
                    shr7 = SHA512.SHR(x, 7);

                return {
                    high: ROTR1.high ^ ROTR8.high ^ shr7.high,
                    low: ROTR1.low ^ ROTR8.low ^ shr7.low
                };
            }
        },
        gamma1: {
            value: function gamma1(x) {
                var ROTR19 = SHA512.ROTR(x, 19);
                var ROTR61 = SHA512.ROTR(x, 61);
                var shr6 = SHA512.SHR(x, 6);

                return {
                    high: ROTR19.high ^ ROTR61.high ^ shr6.high,
                    low: ROTR19.low ^ ROTR61.low ^ shr6.low
                };
            }
        },
        SHR: {
            value: function SHR(x, n) {
                if (n <= 32) {
                    return {
                        high: x.high >>> n,
                        low: x.low >>> n | x.high << 32 - n
                    };
                } else {
                    return {
                        high: 0,
                        low: x.high << 32 - n
                    };
                }
            }
        },
        ROTR: {
            value: function ROTR(x, n) {
                if (n <= 32) {
                    return {
                        high: x.high >>> n | x.low << 32 - n,
                        low: x.low >>> n | x.high << 32 - n
                    };
                } else {
                    return {
                        high: x.low >>> n | x.high << 32 - n,
                        low: x.high >>> n | x.low << 32 - n
                    };
                }
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

    return SHA512;
})();