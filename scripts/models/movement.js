define(function() {
    return {
        tween: function(a, b, delta) {
            if (a < b) {
                return Math.min(a + delta, b);
            } else {
                return Math.max(a - delta, b);
            }
        }
    }
})