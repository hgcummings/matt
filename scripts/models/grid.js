define(function() {
    return {
        init: function() {
            var width = 18;
            var height = 18;
            
            var horizontals = [];
            var verticals = [];
            
            var getWall = function() {
                return Math.max(0, Math.floor(Math.random() * 4) - 1);
            }
            
            for (var i = 0; i < width; ++i) {
                horizontals[i] = [];
                verticals[i] = [];
                for (var j = 0; j < height; ++j) {
                    if (i > 0) {
                        verticals[i][j] = getWall();
                    }
                    if (j > 0) {
                        horizontals[i][j] = getWall();
                    }
                }
            }
            
            return {
                width: width,
                height: height,
                horizontals: horizontals,
                verticals: verticals
            }
        }
    }
})