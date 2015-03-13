/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
export class SHA1 {

    static hash(string) {
        const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

        let l, N, M = [],
            i, j,
            H0 = 0x67452301,
            H1 = 0xefcdab89,
            H2 = 0x98badcfe,
            H3 = 0x10325476,
            H4 = 0xc3d2e1f0;

        string += String.fromCharCode(0x80);
        l = string.length / 4 + 2;
        N = Math.ceil(l / 16);

        for (i = 0; i < N; i++) {
            M[i] = [];
            for (j = 0; j < 16; j++) {
                M[i][j] = (string.charCodeAt(i * 64 + j * 4) << 24) |
                (string.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                (string.charCodeAt(i * 64 + j * 4 + 2) << 8) |
                (string.charCodeAt(i * 64 + j * 4 + 3));
            }
        }

        M[N - 1][14] = ((string.length - 1) * 8) / Math.pow(2, 32);
        M[N - 1][14] = Math.floor(M[N - 1][14]);
        M[N - 1][15] = ((string.length - 1) * 8) & 0xffffffff;

        for (i = 0; i < N; i++) {

            let W = [],
                a = H0,
                b = H1,
                c = H2,
                d = H3,
                e = H4;

            for (let t = 0; t < 16; t++) W[t] = M[i][t];
            for (let t = 16; t < 80; t++) W[t] = SHA1.ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);

            for (let t = 0; t < 80; t++) {
                let s = Math.floor(t / 20);
                let T = (SHA1.ROTL(a, 5) + SHA1.f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
                e = d;
                d = c;
                c = SHA1.ROTL(b, 30);
                b = a;
                a = T;
            }

            H0 = (H0 + a) & 0xffffffff;
            H1 = (H1 + b) & 0xffffffff;
            H2 = (H2 + c) & 0xffffffff;
            H3 = (H3 + d) & 0xffffffff;
            H4 = (H4 + e) & 0xffffffff;
        }

        return SHA1.hex(H0) + SHA1.hex(H1) + SHA1.hex(H2) + SHA1.hex(H3) + SHA1.hex(H4);
    }

    static f(s, x, y, z) {
        switch (s) {
            case 0:
                return (x & y) ^ (~x & z);
            case 1:
                return x ^ y ^ z;
            case 2:
                return (x & y) ^ (x & z) ^ (y & z);
            case 3:
                return x ^ y ^ z;
        }
    }

    static ROTL(x, n) {
        return (x << n) | (x >>> (32 - n));
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