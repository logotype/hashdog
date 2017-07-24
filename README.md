# hashdog
Break MD5/SHA1/SHA256/SHA512 hashes using wordlists, password lists and string permutations.

Written in ES6/ES2015, and runs multiple forked processes for better performance. Using IPC calls in the cluster. Three different strategies are used for finding the correct hash. The first method is a english dictionary, along with a few word variations. The second path is using common passwords, while the third strategy is a bruteforce approach. The approach in this case is standard sequential recursive string permutation.

[![Build Status](https://travis-ci.org/logotype/hashdog.svg?branch=master)](https://travis-ci.org/logotype/hashdog) [![NPM Version](https://badge.fury.io/js/hashdog.svg)](http://badge.fury.io/js/hashdog)

CLI
---

Install hashdog globally, `sudo npm install hashdog -g`. Root permissions needed to extract a data archive (used by the dictionary worker).

Run `Hashdog` in your terminal (run with no arguments for help screen):

```bash
hashdog 6d86ca3c74636711371637c2d73ec3e48dd1737a
```

node
----------

Import and instantiate `Hashdog` (you might need to transpile the codebase from ES6 due to lack of support for modules and other features):

```javascript
import {HashDog} from 'hashdog';
let hashDog = new HashDog({hash: '2655dd21148f2433763d313407d5d820', type: 'MD5', length: 8, chars: 'AaBbCcDdEeFf'});
hashDog.on('success', (data) => {
    console.log(data.hash + ':' + data.string);
});
```

Example output:

```bash
hashdog by @logotype. Copyright © 2017. Released under the MIT license.
Hash: 6d86ca3c74636711371637c2d73ec3e48dd1737a type: SHA1 characters: ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz0123456789
Current rate combined..: 359.47 kHash/s

PROCESS 1: <Dictionary> Words
  Status...............: Unsuccessful
  Uptime...............: 2.92 seconds
  Key length...........: 10
  Keys (tried).........: 235,886
  Keys (total).........: 235,886
  Percentage...........: 100%
  Rate.................: 93.36 kHash/s
  String...............:
PROCESS 2: <Dictionary> Passwords
  Status...............: Working
  Uptime...............: 57.68 seconds
  Key length...........: 9
  Keys (tried).........: 9,453,892
  Keys (total).........: 14,344,391
  Percentage...........: 65.91%
  Rate.................: 159.78 kHash/s
  String...............: brittan90
PROCESS 3: <Bruteforce> Permutations
  Status...............: SUCCESS
  Uptime...............: 57.86 seconds
  Key length...........: 4
  Keys (tried).........: 11,545,148
  Keys (total).........: 13,845,841
  Percentage...........: 83.11%
  Rate.................: 199.69 kHash/s
  String...............: tr1z
----------------------------------------------------------------------
Started................: Fri, 9 Oct 2015 08:23:56 GMT
Ended..................: Fri, 9 Oct 2015 08:24:54 GMT
The process took 57.88 seconds.
6d86ca3c74636711371637c2d73ec3e48dd1737a : tr1z
```

Copyright and license
---------------------

Copyright © 2017 logotype

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

--------------------------
Built with IntelliJ IDEA Open Source License

<a href="https://www.jetbrains.com/buy/opensource/"><img src="https://s3-ap-southeast-1.amazonaws.com/www.logotype.se/assets/logo-text.svg" width="200"></a>

The people at JetBrains supports the Open Source community by offering free licenses. Check out <a href="https://www.jetbrains.com/buy/opensource/">JetBrains Open Source</a> to apply for your project. Thank you!
