# hashdog
Break MD5 hashes using wordlists, password lists and string permutations.

Written in ECMAScript 6, and runs multiple forked processes for better performance. Using IPC calls in the cluster. In the initial version, three different strategies are used for finding the correct hash. The first method is a english dictionary, along with a few word variations. The second path is using common passwords, while the third strategy is a bruteforce approach. The approach in this case is standard sequential recursive string permutation.

Quick start
-----------

Clone the repo, `git clone git://github.com/logotype/hashdog.git`.

Build and run an instance of the `Hashdog` class by running `io.js` in the CLI:

```javascript
gulp
iojs build/hashdog.js
```

Example output:

```bash
THREAD 1:
  Worker...............: <Dictionary> Words
  Status...............: Unsuccessful
  Success..............: false
  Uptime...............: 0.63 seconds
  Keys (tried).........: 5,272
  Keys (total).........: 5,272
  Percentage...........: 100%
  Rate.................: 0 kHash/s
  String...............: 
THREAD 2:
  Worker...............: <Dictionary> Passwords
  Status...............: Reading password list
  Success..............: false
  Uptime...............: 7.70 seconds
  Keys (tried).........: 0
  Keys (total).........: 0
  Percentage...........: 0%
  Rate.................: 0 kHash/s
  String...............: 
THREAD 3:
  Worker...............: <Bruteforce> Permutations
  Status...............: SUCCESS
  Success..............: true
  Uptime...............: 22.981 seconds
  Keys (tried).........: 11,545,148
  Keys (total).........: 13,845,841
  Percentage...........: 82.00%
  Rate.................: 565.65 kHash/s
  String...............: tr1z
----------------------------------------------------------------------
2655dd21148f2433763d313407d5d820 : tr1z
The process took 23.00 seconds.
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