# hashdog
Break MD5/SHA1/SHA256 hashes using wordlists, password lists and string permutations.

Written in ECMAScript 6, and runs multiple forked processes for better performance. Using IPC calls in the cluster. In the initial version, three different strategies are used for finding the correct hash. The first method is a english dictionary, along with a few word variations. The second path is using common passwords, while the third strategy is a bruteforce approach. The approach in this case is standard sequential recursive string permutation.

[![Build Status](https://travis-ci.org/logotype/hashdog.svg?branch=master)](https://travis-ci.org/logotype/hashdog) [![NPM Version](https://badge.fury.io/js/hashdog.svg)](http://badge.fury.io/js/hashdog)

Quick start
-----------

Clone the repo, `git clone git://github.com/logotype/hashdog.git`.

Build and run an instance of the `Hashdog` class by running `hashdog-cli` in the CLI:

```javascript
gulp
./build/hashdog-cli --hash 6d86ca3c74636711371637c2d73ec3e48dd1737a
```

Example output:

```bash
hashdog by @logotype. Copyright © 2015. Released under the MIT license.
Hash: 6d86ca3c74636711371637c2d73ec3e48dd1737a type: SHA1 characters: ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789

THREAD 1:
  Worker...............: <Dictionary> Words
  Status...............: Unsuccessful
  Success..............: false
  Uptime...............: 7.79 seconds
  Key length...........: 10
  Keys (tried).........: 235,886
  Keys (total).........: 235,886
  Percentage...........: 100%
  Rate.................: 32.55 kHash/s
  String...............:
THREAD 2:
  Worker...............: <Dictionary> Passwords
  Status...............: Unsuccessful
  Success..............: false
  Uptime...............: 106.90 seconds
  Key length...........: 12
  Keys (tried).........: 14,342,365
  Keys (total).........: 14,342,365
  Percentage...........: 100%
  Rate.................: 184.54 kHash/s
  String...............:
THREAD 3:
  Worker...............: <Bruteforce> Permutations
  Status...............: SUCCESS
  Success..............: true
  Uptime...............: 187.713 seconds
  Key length...........: 4
  Keys (tried).........: 11,545,148
  Keys (total).........: 13,845,841
  Percentage...........: 83.36%
  Rate.................: 70.31 kHash/s
  String...............: tr1z
----------------------------------------------------------------------
6d86ca3c74636711371637c2d73ec3e48dd1737a : tr1z
Started................: Fri, 13 Mar 2015 14:14:40 GMT
Ended..................: Fri, 13 Mar 2015 14:17:48 GMT
The process took 187.75 seconds.
```

Copyright and license
---------------------

Copyright © 2015 logotype

Author: Victor Norgren

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:  The above copyright
notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.