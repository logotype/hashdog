/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
export class SHA1 {

    static hash(string) {
        return SHA1.stringToHex(SHA1.arrayToString(SHA1.run(SHA1.stringToArray(string), string.length * 8)));
    }

    static run(input, len) {
        let i = 0,
            l = (len + 64 >> 9 << 4) + 15,
            W = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

        input[len >> 5] |= 0x80 << 24 - len % 32;
        input[l] = len;

        for (; i < l; i += 16) {
            H0 = a;
            H1 = b;
            H2 = c;
            H3 = d;
            H4 = e;

            let j = 0,
                t;

            for (; j < 80; j += 1) {
                if (j < 16) {
                    W[j] = input[i + j];
                } else {
                    W[j] = SHA1.rotl(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);
                }
                t = SHA1.add(SHA1.add(SHA1.rotl(a, 5), SHA1.chMajPty(j, b, c, d)), SHA1.add(SHA1.add(e, W[j]), SHA1.cnst(j)));
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

        return [a, b, c, d, e];
    }

    static arrayToString(input) {
        let i = 0,
            l = input.length * 32,
            output = '';
        for (; i < l; i += 8) {
            output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 0xFF);
        }
        return output;
    }

    static stringToArray(input) {
        let i, l = input.length * 8,
            output = Array(input.length >> 2),
            lo = output.length;
        for (i = 0; i < lo; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < l; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << 24 - i % 32;
        }
        return output;
    }

    static stringToHex(input) {
        let hex = '0123456789abcdef',
            output = '',
            x, i = 0,
            l = input.length;
        for (; i < l; i += 1) {
            x = input.charCodeAt(i);
            output += hex.charAt(x >>> 4 & 0x0F) + hex.charAt(x & 0x0F);
        }
        return output;
    }

    static chMajPty(t, b, c, d) {
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

    static cnst(t) {
        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    }

    static rotl(x, n) {
        return x << n | x >>> 32 - n;
    }

    static add(x, y) {
        let lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xFFFF;
    }
}