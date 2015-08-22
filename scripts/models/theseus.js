define(['input', 'models/movement'], function(input, movement) {
    var speed = 0.0032; // Squares per millisecond
    var wallMovingSpeed = 0.0004;
    var target = null;

    return {
        init: function(grid) {
            var update = function(dt) {
                
            }
            
            var state = {
                update: update,
                x: grid.width / 2,
                y: 0.5
            };
                
            return state;
        }
    }
});