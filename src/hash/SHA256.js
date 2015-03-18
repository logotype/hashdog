/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
export class SHA256 {

    static hash(string) {
        return SHA256.stringToHex(SHA256.arrayToString(SHA256.run(SHA256.stringToArray(string), string.length * 8)));
    }

    static run(input, len) {

        const K = new Uint32Array([
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ]);

        let i, j,
            T1, T2,
            W = Array(64),
            H0 = 1779033703,
            H1 = -1150833019,
            H2 = 1013904242,
            H3 = -1521486534,
            H4 = 1359893119,
            H5 = -1694144372,
            H6 = 528734635,
            H7 = 1541459225,
            a = H0,
            b = H1,
            c = H2,
            d = H3,
            e = H4,
            f = H5,
            g = H6,
            h = H7;

        input[len >> 5] |= 0x80 << (24 - len % 32);
        input[((len + 64 >> 9) << 4) + 15] = len;

        for (i = 0; i < input.length; i += 16) {
            H0 = a;
            H1 = b;
            H2 = c;
            H3 = d;
            H4 = e;
            H5 = f;
            H6 = g;
            H7 = h;

            for (j = 0; j < 64; j += 1) {
                if (j < 16) {
                    W[j] = input[j + i];
                } else {
                    W[j] = SHA256.add(SHA256.add(SHA256.add(SHA256.gamma1256(W[j - 2]), W[j - 7]), SHA256.gamma0256(W[j - 15])), W[j - 16]);
                }

                T1 = SHA256.add(SHA256.add(SHA256.add(SHA256.add(h, SHA256.sigma1256(e)), SHA256.ch(e, f, g)), K[j]), W[j]);
                T2 = SHA256.add(SHA256.sigma0256(a), SHA256.maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = SHA256.add(d, T1);
                d = c;
                c = b;
                b = a;
                a = SHA256.add(T1, T2);
            }

            a = SHA256.add(a, H0);
            b = SHA256.add(b, H1);
            c = SHA256.add(c, H2);
            d = SHA256.add(d, H3);
            e = SHA256.add(e, H4);
            f = SHA256.add(f, H5);
            g = SHA256.add(g, H6);
            h = SHA256.add(h, H7);
        }
        return Array(a, b, c, d, e, f, g, h);
    }

    static arrayToString(input) {
        let i, l = input.length * 32, output = '';
        for (i = 0; i < l; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
        }
        return output;
    }

    static stringToArray(input) {
        let i, l = input.length * 8, output = Array(input.length >> 2), lo = output.length;
        for (i = 0; i < lo; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < l; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
        }
        return output;
    }

    static stringToHex(input) {
        let hex_tab = '0123456789abcdef', output = '', x, i = 0, l = input.length;
        for (; i < l; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    static rotl(X, n) {
        return (X >>> n) | (X << (32 - n));
    }

    static rotr(X, n) {
        return (X >>> n);
    }

    static ch(x, y, z) {
        return ((x & y) ^ ((~x) & z));
    }

    static maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z));
    }

    static sigma0256(x) {
        return (SHA256.rotl(x, 2) ^ SHA256.rotl(x, 13) ^ SHA256.rotl(x, 22));
    }

    static sigma1256(x) {
        return (SHA256.rotl(x, 6) ^ SHA256.rotl(x, 11) ^ SHA256.rotl(x, 25));
    }

    static gamma0256(x) {
        return (SHA256.rotl(x, 7) ^ SHA256.rotl(x, 18) ^ SHA256.rotr(x, 3));
    }

    static gamma1256(x) {
        return (SHA256.rotl(x, 17) ^ SHA256.rotl(x, 19) ^ SHA256.rotr(x, 10));
    }

    static add(x, y) {
        let lsw = (x & 0xFFFF) + (y & 0xFFFF), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
}