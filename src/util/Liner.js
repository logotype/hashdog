/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2017 Victor Norgren
 * Released under the MIT license
 */
const stream = require('stream');
const liner = new stream.Transform({
    objectMode: true
});

liner._transform = function(chunk, encoding, done) {
    let data = '', lines = [];
    data = chunk.toString();
    if (this._lastLineData) {
        data = this._lastLineData + data;
    }

    lines = data.split('\n');
    this._lastLineData = lines.splice(lines.length - 1, 1)[0];

    lines.forEach(this.push.bind(this));
    done();
};

liner._flush = function(done) {
    if (this._lastLineData) {
        this.push(this._lastLineData);
    }
    this._lastLineData = null;
    done();
};

module.exports = liner;
