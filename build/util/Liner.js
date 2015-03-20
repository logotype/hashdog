/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
"use strict";

var stream = require("stream");
var liner = new stream.Transform({
    objectMode: true
});

liner._transform = function (chunk, encoding, done) {
    "use strict";
    var data = chunk.toString();
    if (this._lastLineData) {
        data = this._lastLineData + data;
    }

    var lines = data.split("\n");
    this._lastLineData = lines.splice(lines.length - 1, 1)[0];

    lines.forEach(this.push.bind(this));
    done();
};

liner._flush = function (done) {
    "use strict";
    if (this._lastLineData) {
        this.push(this._lastLineData);
    }
    this._lastLineData = null;
    done();
};

module.exports = liner;