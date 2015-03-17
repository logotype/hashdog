var HashDog, hashDog;
HashDog = require('./../build/HashDog').HashDog;
hashDog = new HashDog({hash: '2655dd21148f2433763d313407d5d820', type: 'MD5', chars: 'abcdefghijklmnopqrstuvwxyz0123456789'});
hashDog.on('success', function(data) {
    "use strict";
    console.log(data);
});