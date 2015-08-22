define(function() {
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
        }
    }
})