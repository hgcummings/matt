define(function() {
    'use strict';
    return {
        /*
         Tweening function, assumes that a and b differ by 1
        */
        tween: function(a, b, delta) {
            if (a < b) {
                return Math.min(a + delta, b);
            } else {
                return Math.max(a - delta, b);
            }
        },
        directionVector: function(direction) {
            var ret = [0,0];
            switch (direction) {
            case 0:
                ret[1] = -1;
                break;
            case 1:
                ret[0] = 1;
                break;
            case 2:
                ret[1] += 1;
                break;
            case 3:
                ret[0] = -1;
                break;
            }
            return ret;
        }
    };
});