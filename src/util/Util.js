/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
export class Util {
    static numberWithCommas(x) {
        const parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    static replaceCharAtIndex(str, index, chr) {
        if (index > str.length - 1) {
            return str;
        }
        return str.substr(0, index) + chr + str.substr(index + 1);
    }

    static cls() {
        process.stdout.write('\u001B[2J\u001B[0;0f');
    }
}