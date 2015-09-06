angular.module('app').service('meemaCryptoService',
    ['$rootScope',
    function ($rootScope) {

        this.encrypt = function(password) {
            var bin = stringToBinary(password);
            var rand = getRandomBitstream(bin.length);
            var xored = xor(bin, rand);
            return [btoa(binaryToString(xored)), btoa(binaryToString(rand))];
        };

        this.decrypt = function(frag1, frag2) {
            console.log('frags', frag1, frag2);
            var bit1 = stringToBinary(atob(frag1));
            var bit2 = stringToBinary(atob(frag2));
            var xored = xor(bit1, bit2);
            return binaryToString(xored);
        };

        var getRandomBitstream = function(length) {
            var rand = '';
            while (rand.length < length) {
                rand = rand.concat(decimalToBinary(window.crypto.getRandomValues(new Int32Array(1))[0]));
            }
            return rand.substring(0, length);
        };

        var xor = function(bin1, bin2) {
            var xored = '';
            for (var i = 0; i < bin1.length; i++) {
                xored = xored.concat((parseInt(bin1.charAt(i), 10) ^ parseInt(bin2.charAt(i), 10)).toString());
            }
            return xored;
        };

        var stringToBinary = function(str){
            var st,i,j,d;
            var arr = [];
            var len = str.length;
            for (i = 1; i<=len; i++){
                //reverse so its like a stack
                d = str.charCodeAt(len-i);
                for (j = 0; j < 8; j++) {
                    arr.push(d%2);
                    d = Math.floor(d/2);
                }
            }
            //reverse all bits again.
            return arr.reverse().join("");
        };

        var binaryToString = function(str) {
            if (str.match(/[10]{8}/g)) {
                var wordFromBinary = str.match(/([10]{8}|\s+)/g).map(function(fromBinary){
                    return String.fromCharCode(parseInt(fromBinary, 2) );
                }).join('');
                return wordFromBinary;
            }
        };

        var decimalToBinary = function(dec) {
            return (dec >>> 0).toString(2);
        };

        var binaryToDecimal = function(bin) {
            return parseInt(bin, 2);
        };

    }
]);