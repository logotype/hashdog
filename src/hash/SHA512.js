/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
export class SHA512 {

    static hash(string) {
        const K = [
            {high: 0x428a2f98, low: 0xd728ae22}, {high: 0x71374491, low: 0x23ef65cd},
            {high: 0xb5c0fbcf, low: 0xec4d3b2f}, {high: 0xe9b5dba5, low: 0x8189dbbc},
            {high: 0x3956c25b, low: 0xf348b538}, {high: 0x59f111f1, low: 0xb605d019},
            {high: 0x923f82a4, low: 0xaf194f9b}, {high: 0xab1c5ed5, low: 0xda6d8118},
            {high: 0xd807aa98, low: 0xa3030242}, {high: 0x12835b01, low: 0x45706fbe},
            {high: 0x243185be, low: 0x4ee4b28c}, {high: 0x550c7dc3, low: 0xd5ffb4e2},
            {high: 0x72be5d74, low: 0xf27b896f}, {high: 0x80deb1fe, low: 0x3b1696b1},
            {high: 0x9bdc06a7, low: 0x25c71235}, {high: 0xc19bf174, low: 0xcf692694},
            {high: 0xe49b69c1, low: 0x9ef14ad2}, {high: 0xefbe4786, low: 0x384f25e3},
            {high: 0x0fc19dc6, low: 0x8b8cd5b5}, {high: 0x240ca1cc, low: 0x77ac9c65},
            {high: 0x2de92c6f, low: 0x592b0275}, {high: 0x4a7484aa, low: 0x6ea6e483},
            {high: 0x5cb0a9dc, low: 0xbd41fbd4}, {high: 0x76f988da, low: 0x831153b5},
            {high: 0x983e5152, low: 0xee66dfab}, {high: 0xa831c66d, low: 0x2db43210},
            {high: 0xb00327c8, low: 0x98fb213f}, {high: 0xbf597fc7, low: 0xbeef0ee4},
            {high: 0xc6e00bf3, low: 0x3da88fc2}, {high: 0xd5a79147, low: 0x930aa725},
            {high: 0x06ca6351, low: 0xe003826f}, {high: 0x14292967, low: 0x0a0e6e70},
            {high: 0x27b70a85, low: 0x46d22ffc}, {high: 0x2e1b2138, low: 0x5c26c926},
            {high: 0x4d2c6dfc, low: 0x5ac42aed}, {high: 0x53380d13, low: 0x9d95b3df},
            {high: 0x650a7354, low: 0x8baf63de}, {high: 0x766a0abb, low: 0x3c77b2a8},
            {high: 0x81c2c92e, low: 0x47edaee6}, {high: 0x92722c85, low: 0x1482353b},
            {high: 0xa2bfe8a1, low: 0x4cf10364}, {high: 0xa81a664b, low: 0xbc423001},
            {high: 0xc24b8b70, low: 0xd0f89791}, {high: 0xc76c51a3, low: 0x0654be30},
            {high: 0xd192e819, low: 0xd6ef5218}, {high: 0xd6990624, low: 0x5565a910},
            {high: 0xf40e3585, low: 0x5771202a}, {high: 0x106aa070, low: 0x32bbd1b8},
            {high: 0x19a4c116, low: 0xb8d2d0c8}, {high: 0x1e376c08, low: 0x5141ab53},
            {high: 0x2748774c, low: 0xdf8eeb99}, {high: 0x34b0bcb5, low: 0xe19b48a8},
            {high: 0x391c0cb3, low: 0xc5c95a63}, {high: 0x4ed8aa4a, low: 0xe3418acb},
            {high: 0x5b9cca4f, low: 0x7763e373}, {high: 0x682e6ff3, low: 0xd6b2b8a3},
            {high: 0x748f82ee, low: 0x5defb2fc}, {high: 0x78a5636f, low: 0x43172f60},
            {high: 0x84c87814, low: 0xa1f0ab72}, {high: 0x8cc70208, low: 0x1a6439ec},
            {high: 0x90befffa, low: 0x23631e28}, {high: 0xa4506ceb, low: 0xde82bde9},
            {high: 0xbef9a3f7, low: 0xb2c67915}, {high: 0xc67178f2, low: 0xe372532b},
            {high: 0xca273ece, low: 0xea26619c}, {high: 0xd186b8c7, low: 0x21c0c207},
            {high: 0xeada7dd6, low: 0xcde0eb1e}, {high: 0xf57d4f7f, low: 0xee6ed178},
            {high: 0x06f067aa, low: 0x72176fba}, {high: 0x0a637dc5, low: 0xa2c898a6},
            {high: 0x113f9804, low: 0xbef90dae}, {high: 0x1b710b35, low: 0x131c471b},
            {high: 0x28db77f5, low: 0x23047d84}, {high: 0x32caab7b, low: 0x40c72493},
            {high: 0x3c9ebe0a, low: 0x15c9bebc}, {high: 0x431d67c4, low: 0x9c100d4c},
            {high: 0x4cc5d4be, low: 0xcb3e42b6}, {high: 0x597f299c, low: 0xfc657e2a},
            {high: 0x5fcb6fab, low: 0x3ad6faec}, {high: 0x6c44198c, low: 0x4a475817}
        ];

        let H = [
                {high: 0x6a09e667, low: 0xf3bcc908}, {high: 0xbb67ae85, low: 0x84caa73b},
                {high: 0x3c6ef372, low: 0xfe94f82b}, {high: 0xa54ff53a, low: 0x5f1d36f1},
                {high: 0x510e527f, low: 0xade682d1}, {high: 0x9b05688c, low: 0x2b3e6c1f},
                {high: 0x1f83d9ab, low: 0xfb41bd6b}, {high: 0x5be0cd19, low: 0x137e2179}
            ],
            W = [],
            a, b, c, d, e, f, g, h, i,
            N, T1, T2,
            stringArray = [],
            stringLength = (string.length * 8);

        for (i = 0; i < stringLength; i += 8) {
            stringArray[i >> 5] |= (string.charCodeAt(i / 8) & ((1 << 8) - 1)) << (32 - 8 - (i % 32));
        }

        stringArray[stringLength >> 5] |= 0x80 << (24 - stringLength % 32);
        stringArray[(((stringLength + 128) >> 10) << 5) + 31] = stringLength;
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

            for (let t = 0; t < 80; t++) {
                if (t < 16) {
                    W[t] = {
                        high: string[t * 2 + i],
                        low: string[t * 2 + i + 1]
                    };
                } else {
                    W[t] = SHA512.add4(SHA512.gamma1(W[t - 2]), W[t - 7], SHA512.gamma0(W[t - 15]), W[t - 16]);
                }

                T1 = SHA512.add5(h, SHA512.sigma1(e), SHA512.ch(e, f, g), K[t], W[t]);
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

    static add2(x, y) {
        let lsw, msw, low, high;

        lsw = (x.low & 0xFFFF) + (y.low & 0xFFFF);
        msw = (x.low >>> 16) + (y.low >>> 16) + (lsw >>> 16);
        low = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (x.high & 0xFFFF) + (y.high & 0xFFFF) + (msw >>> 16);
        msw = (x.high >>> 16) + (y.high >>> 16) + (lsw >>> 16);
        high = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return {
            high: high,
            low: low
        };
    }

    static add4(a, b, c, d) {
        let lsw, msw, low, high;

        lsw = (a.low & 0xFFFF) + (b.low & 0xFFFF) + (c.low & 0xFFFF) + (d.low & 0xFFFF);
        msw = (a.low >>> 16) + (b.low >>> 16) + (c.low >>> 16) + (d.low >>> 16) + (lsw >>> 16);
        low = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.high & 0xFFFF) + (b.high & 0xFFFF) + (c.high & 0xFFFF) + (d.high & 0xFFFF) + (msw >>> 16);
        msw = (a.high >>> 16) + (b.high >>> 16) + (c.high >>> 16) + (d.high >>> 16) + (lsw >>> 16);
        high = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return {
            high: high,
            low: low
        };
    }

    static add5(a, b, c, d, e) {
        let lsw, msw, low, high;

        lsw = (a.low & 0xFFFF) + (b.low & 0xFFFF) + (c.low & 0xFFFF) + (d.low & 0xFFFF) + (e.low & 0xFFFF);
        msw = (a.low >>> 16) + (b.low >>> 16) + (c.low >>> 16) + (d.low >>> 16) + (e.low >>> 16) + (lsw >>> 16);
        low = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.high & 0xFFFF) + (b.high & 0xFFFF) + (c.high & 0xFFFF) + (d.high & 0xFFFF) + (e.high & 0xFFFF) + (msw >>> 16);
        msw = (a.high >>> 16) + (b.high >>> 16) + (c.high >>> 16) + (d.high >>> 16) + (e.high >>> 16) + (lsw >>> 16);
        high = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return {
            high: high,
            low: low
        };
    }

    static maj(x, y, z) {
        return {
            high: (x.high & y.high) ^ (x.high & z.high) ^ (y.high & z.high),
            low: (x.low & y.low) ^ (x.low & z.low) ^ (y.low & z.low)
        };
    }

    static ch(x, y, z) {
        return {
            high: (x.high & y.high) ^ (~x.high & z.high),
            low: (x.low & y.low) ^ (~x.low & z.low)
        };
    }

    static sigma0(x) {
        let ROTR28 = SHA512.ROTR(x, 28);
        let ROTR34 = SHA512.ROTR(x, 34);
        let ROTR39 = SHA512.ROTR(x, 39);

        return {
            high: ROTR28.high ^ ROTR34.high ^ ROTR39.high,
            low: ROTR28.low ^ ROTR34.low ^ ROTR39.low
        };
    }

    static sigma1(x) {
        let ROTR14 = SHA512.ROTR(x, 14);
        let ROTR18 = SHA512.ROTR(x, 18);
        let ROTR41 = SHA512.ROTR(x, 41);

        return {
            high: ROTR14.high ^ ROTR18.high ^ ROTR41.high,
            low: ROTR14.low ^ ROTR18.low ^ ROTR41.low
        };
    }

    static gamma0(x) {
        let ROTR1 = SHA512.ROTR(x, 1),
            ROTR8 = SHA512.ROTR(x, 8),
            shr7 = SHA512.SHR(x, 7);

        return {
            high: ROTR1.high ^ ROTR8.high ^ shr7.high,
            low: ROTR1.low ^ ROTR8.low ^ shr7.low
        };
    }

    static gamma1(x) {
        let ROTR19 = SHA512.ROTR(x, 19);
        let ROTR61 = SHA512.ROTR(x, 61);
        let shr6 = SHA512.SHR(x, 6);

        return {
            high: ROTR19.high ^ ROTR61.high ^ shr6.high,
            low: ROTR19.low ^ ROTR61.low ^ shr6.low
        };
    }

    static SHR(x, n) {
        if (n <= 32) {
            return {
                high: x.high >>> n,
                low: x.low >>> n | (x.high << (32 - n))
            };
        } else {
            return {
                high: 0,
                low: x.high << (32 - n)
            };
        }
    }

    static ROTR(x, n) {
        if (n <= 32) {
            return {
                high: (x.high >>> n) | (x.low << (32 - n)),
                low: (x.low >>> n) | (x.high << (32 - n))
            };
        } else {
            return {
                high: (x.low >>> n) | (x.high << (32 - n)),
                low: (x.high >>> n) | (x.low << (32 - n))
            };
        }
    }

    static hex(string) {
        let outputString = '',
            v,
            i = 7;
        for (i; i >= 0; i--) {
            v = (string >>> (i * 4)) & 0xf;
            outputString += v.toString(16);
        }
        return outputString;
    }
}