/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
export class SHA256 {

    static hash(string) {
        const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];

        let H0 = 0x6a09e667,
            H1 = 0xbb67ae85,
            H2 = 0x3c6ef372,
            H3 = 0xa54ff53a,
            H4 = 0x510e527f,
            H5 = 0x9b05688c,
            H6 = 0x1f83d9ab,
            H7 = 0x5be0cd19,
            M = [],
            W = [],
            N, i, j, T1, T2,
            a = H0,
            b = H1,
            c = H2,
            d = H3,
            e = H4,
            f = H5,
            g = H6,
            h = H7;

        string += String.fromCharCode(0x80);
        N = Math.ceil((string.length / 4 + 2) / 16);

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

            W = [];
            a = H0;
            b = H1;
            c = H2;
            d = H3;
            e = H4;
            f = H5;
            g = H6;
            h = H7;

            for (let t = 0; t < 64; t++) {
                if(t < 16) {
                    W[t] = M[i][t];
                } else {
                    W[t] = (SHA256.sigma1(W[t - 2]) + W[t - 7] + SHA256.sigma0(W[t - 15]) + W[t - 16]) & 0xffffffff;
                }

                T1 = h + SHA256.gamma1(e) + SHA256.add4(e, f, g) + K[t] + W[t];
                T2 = SHA256.gamma0(a) + SHA256.add5(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }

            H0 = (H0 + a) & 0xffffffff;
            H1 = (H1 + b) & 0xffffffff;
            H2 = (H2 + c) & 0xffffffff;
            H3 = (H3 + d) & 0xffffffff;
            H4 = (H4 + e) & 0xffffffff;
            H5 = (H5 + f) & 0xffffffff;
            H6 = (H6 + g) & 0xffffffff;
            H7 = (H7 + h) & 0xffffffff;
        }

        return SHA256.hex(H0) + SHA256.hex(H1) + SHA256.hex(H2) + SHA256.hex(H3) + SHA256.hex(H4) + SHA256.hex(H5) + SHA256.hex(H6) + SHA256.hex(H7);
    }

    static gamma0(x) {
        return SHA256.ROTR(2, x) ^ SHA256.ROTR(13, x) ^ SHA256.ROTR(22, x);
    }

    static gamma1(x) {
        return SHA256.ROTR(6, x) ^ SHA256.ROTR(11, x) ^ SHA256.ROTR(25, x);
    }

    static sigma0(x) {
        return SHA256.ROTR(7, x) ^ SHA256.ROTR(18, x) ^ (x >>> 3);
    }

    static sigma1(x) {
        return SHA256.ROTR(17, x) ^ SHA256.ROTR(19, x) ^ (x >>> 10);
    }

    static add4(x, y, z) {
        return (x & y) ^ (~x & z);
    }

    static add5(x, y, z) {
        return (x & y) ^ (x & z) ^ (y & z);
    }

    static ROTR(n, x) {
        return (x >>> n) | (x << (32 - n));
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