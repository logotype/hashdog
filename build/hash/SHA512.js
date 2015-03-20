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

var Int64 = require("./Int64").Int64;

var SHA512 = exports.SHA512 = (function () {
    function SHA512() {
        _classCallCheck(this, SHA512);
    }

    _createClass(SHA512, null, {
        hash: {
            value: function hash(string) {
                return SHA512.stringToHex(SHA512.arrayToString(SHA512.run(SHA512.stringToArray(string), string.length * 8)));
            }
        },
        run: {
            value: function run(input, len) {
                var K = [new Int64(1116352408, -685199838), new Int64(1899447441, 602891725), new Int64(-1245643825, -330482897), new Int64(-373957723, -2121671748), new Int64(961987163, -213338824), new Int64(1508970993, -1241133031), new Int64(-1841331548, -1357295717), new Int64(-1424204075, -630357736), new Int64(-670586216, -1560083902), new Int64(310598401, 1164996542), new Int64(607225278, 1323610764), new Int64(1426881987, -704662302), new Int64(1925078388, -226784913), new Int64(-2132889090, 991336113), new Int64(-1680079193, 633803317), new Int64(-1046744716, -815192428), new Int64(-459576895, -1628353838), new Int64(-272742522, 944711139), new Int64(264347078, -1953704523), new Int64(604807628, 2007800933), new Int64(770255983, 1495990901), new Int64(1249150122, 1856431235), new Int64(1555081692, -1119749164), new Int64(1996064986, -2096016459), new Int64(-1740746414, -295247957), new Int64(-1473132947, 766784016), new Int64(-1341970488, -1728372417), new Int64(-1084653625, -1091629340), new Int64(-958395405, 1034457026), new Int64(-710438585, -1828018395), new Int64(113926993, -536640913), new Int64(338241895, 168717936), new Int64(666307205, 1188179964), new Int64(773529912, 1546045734), new Int64(1294757372, 1522805485), new Int64(1396182291, -1651133473), new Int64(1695183700, -1951439906), new Int64(1986661051, 1014477480), new Int64(-2117940946, 1206759142), new Int64(-1838011259, 344077627), new Int64(-1564481375, 1290863460), new Int64(-1474664885, -1136513023), new Int64(-1035236496, -789014639), new Int64(-949202525, 106217008), new Int64(-778901479, -688958952), new Int64(-694614492, 1432725776), new Int64(-200395387, 1467031594), new Int64(275423344, 851169720), new Int64(430227734, -1194143544), new Int64(506948616, 1363258195), new Int64(659060556, -544281703), new Int64(883997877, -509917016), new Int64(958139571, -976659869), new Int64(1322822218, -482243893), new Int64(1537002063, 2003034995), new Int64(1747873779, -692930397), new Int64(1955562222, 1575990012), new Int64(2024104815, 1125592928), new Int64(-2067236844, -1578062990), new Int64(-1933114872, 442776044), new Int64(-1866530822, 593698344), new Int64(-1538233109, -561857047), new Int64(-1090935817, -1295615723), new Int64(-965641998, -479046869), new Int64(-903397682, -366583396), new Int64(-779700025, 566280711), new Int64(-354779690, -840897762), new Int64(-176337025, -294727304), new Int64(116418474, 1914138554), new Int64(174292421, -1563912026), new Int64(289380356, -1090974290), new Int64(460393269, 320620315), new Int64(685471733, 587496836), new Int64(852142971, 1086792851), new Int64(1017036298, 365543100), new Int64(1126000580, -1676669620), new Int64(1288033470, -885112138), new Int64(1501505948, -60457430), new Int64(1607167915, 987167468), new Int64(1816402316, 1246189591)],
                    j = undefined,
                    i = undefined,
                    l = undefined,
                    T1 = new Int64(0, 0),
                    T2 = new Int64(0, 0),
                    W = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    hash = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    H = [new Int64(1779033703, -205731576), new Int64(-1150833019, -2067093701), new Int64(1013904242, -23791573), new Int64(-1521486534, 1595750129), new Int64(1359893119, -1377402159), new Int64(-1694144372, 725511199), new Int64(528734635, -79577749), new Int64(1541459225, 327033209)],
                    a = new Int64(0, 0),
                    b = new Int64(0, 0),
                    c = new Int64(0, 0),
                    d = new Int64(0, 0),
                    e = new Int64(0, 0),
                    f = new Int64(0, 0),
                    g = new Int64(0, 0),
                    h = new Int64(0, 0),
                    s0 = new Int64(0, 0),
                    s1 = new Int64(0, 0),
                    Ch = new Int64(0, 0),
                    Maj = new Int64(0, 0),
                    r1 = new Int64(0, 0),
                    r2 = new Int64(0, 0),
                    r3 = new Int64(0, 0);

                for (i = 0; i < 80; i += 1) {
                    W[i] = new Int64(0, 0);
                }

                input[len >> 5] |= 128 << 24 - (len & 31);
                input[(len + 128 >> 10 << 5) + 31] = len;
                l = input.length;

                for (i = 0; i < l; i += 32) {
                    Int64.copy(a, H[0]);
                    Int64.copy(b, H[1]);
                    Int64.copy(c, H[2]);
                    Int64.copy(d, H[3]);
                    Int64.copy(e, H[4]);
                    Int64.copy(f, H[5]);
                    Int64.copy(g, H[6]);
                    Int64.copy(h, H[7]);

                    for (j = 0; j < 16; j += 1) {
                        W[j].h = input[i + 2 * j];
                        W[j].l = input[i + 2 * j + 1];
                    }

                    for (j = 16; j < 80; j += 1) {
                        Int64.rotr(r1, W[j - 2], 19);
                        Int64.rotl(r2, W[j - 2], 29);
                        Int64.shr(r3, W[j - 2], 6);
                        s1.l = r1.l ^ r2.l ^ r3.l;
                        s1.h = r1.h ^ r2.h ^ r3.h;

                        Int64.rotr(r1, W[j - 15], 1);
                        Int64.rotr(r2, W[j - 15], 8);
                        Int64.shr(r3, W[j - 15], 7);
                        s0.l = r1.l ^ r2.l ^ r3.l;
                        s0.h = r1.h ^ r2.h ^ r3.h;

                        Int64.add4(W[j], s1, W[j - 7], s0, W[j - 16]);
                    }

                    for (j = 0; j < 80; j += 1) {
                        Ch.l = e.l & f.l ^ ~e.l & g.l;
                        Ch.h = e.h & f.h ^ ~e.h & g.h;

                        Int64.rotr(r1, e, 14);
                        Int64.rotr(r2, e, 18);
                        Int64.rotl(r3, e, 9);
                        s1.l = r1.l ^ r2.l ^ r3.l;
                        s1.h = r1.h ^ r2.h ^ r3.h;

                        Int64.rotr(r1, a, 28);
                        Int64.rotl(r2, a, 2);
                        Int64.rotl(r3, a, 7);
                        s0.l = r1.l ^ r2.l ^ r3.l;
                        s0.h = r1.h ^ r2.h ^ r3.h;

                        Maj.l = a.l & b.l ^ a.l & c.l ^ b.l & c.l;
                        Maj.h = a.h & b.h ^ a.h & c.h ^ b.h & c.h;

                        Int64.add5(T1, h, s1, Ch, K[j], W[j]);
                        Int64.add(T2, s0, Maj);

                        Int64.copy(h, g);
                        Int64.copy(g, f);
                        Int64.copy(f, e);
                        Int64.add(e, d, T1);
                        Int64.copy(d, c);
                        Int64.copy(c, b);
                        Int64.copy(b, a);
                        Int64.add(a, T1, T2);
                    }

                    Int64.add(H[0], H[0], a);
                    Int64.add(H[1], H[1], b);
                    Int64.add(H[2], H[2], c);
                    Int64.add(H[3], H[3], d);
                    Int64.add(H[4], H[4], e);
                    Int64.add(H[5], H[5], f);
                    Int64.add(H[6], H[6], g);
                    Int64.add(H[7], H[7], h);
                }

                for (i = 0; i < 8; i += 1) {
                    hash[2 * i] = H[i].h;
                    hash[2 * i + 1] = H[i].l;
                }

                return hash;
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
        }
    });

    return SHA512;
})();