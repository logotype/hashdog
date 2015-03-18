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

var Int64 = exports.Int64 = (function () {
    function Int64(h, l) {
        _classCallCheck(this, Int64);

        this.h = h;
        this.l = l;
    }

    _createClass(Int64, null, {
        copy: {
            value: function copy(dst, src) {
                dst.h = src.h;
                dst.l = src.l;
            }
        },
        shr: {
            value: function shr(dst, x, shift) {
                dst.l = x.l >>> shift | x.h << 32 - shift;
                dst.h = x.h >>> shift;
            }
        },
        rotr: {
            value: function rotr(dst, x, shift) {
                dst.l = x.l >>> shift | x.h << 32 - shift;
                dst.h = x.h >>> shift | x.l << 32 - shift;
            }
        },
        rotl: {
            value: function rotl(dst, x, shift) {
                dst.l = x.h >>> shift | x.l << 32 - shift;
                dst.h = x.l >>> shift | x.h << 32 - shift;
            }
        },
        add: {
            value: function add(dst, x, y) {
                var w0 = (x.l & 65535) + (y.l & 65535);
                var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
                var w2 = (x.h & 65535) + (y.h & 65535) + (w1 >>> 16);
                var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
                dst.l = w0 & 65535 | w1 << 16;
                dst.h = w2 & 65535 | w3 << 16;
            }
        },
        add4: {
            value: function add4(dst, a, b, c, d) {
                var w0 = (a.l & 65535) + (b.l & 65535) + (c.l & 65535) + (d.l & 65535);
                var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
                var w2 = (a.h & 65535) + (b.h & 65535) + (c.h & 65535) + (d.h & 65535) + (w1 >>> 16);
                var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
                dst.l = w0 & 65535 | w1 << 16;
                dst.h = w2 & 65535 | w3 << 16;
            }
        },
        add5: {
            value: function add5(dst, a, b, c, d, e) {
                var w0 = (a.l & 65535) + (b.l & 65535) + (c.l & 65535) + (d.l & 65535) + (e.l & 65535),
                    w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16),
                    w2 = (a.h & 65535) + (b.h & 65535) + (c.h & 65535) + (d.h & 65535) + (e.h & 65535) + (w1 >>> 16),
                    w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
                dst.l = w0 & 65535 | w1 << 16;
                dst.h = w2 & 65535 | w3 << 16;
            }
        }
    });

    return Int64;
})();