define(['input'], function(input) {
    var speed = 0.0015; // Squares per millisecond
    var target = null;
        
    var tween = function(a, b, dt) {
        if (dt < 0) {
            console.log(dt);
        }
        if (a < b) {
            return Math.min(a + (speed * dt), b);
        } else {
            return Math.max(a - (speed * dt), b);
        }
    }
        
    return {
        init: function(grid) {
            var x = grid.width / 2;
            var y = grid.height / 2;
            var update = function(dt) {
                if (target) {
                    x = tween(x, target[0], dt);
                    y = tween(y, target[1], dt);
                    if (x === target[0] && y === target[1]) {
                        target = null;
                    }
                } else if (input.getDirection() !== null) {
                    switch(input.getDirection()) {
                        case 0:
                            target = [x, y - 1];
                            break;
                        case 1:
                            target = [x + 1, y];
                            break;
                        case 2:
                            target = [x, y + 1];
                            break;
                        case 3:
                            target = [x - 1, y];
                            break;
                    }
                }
                
                return {
                    update: update,
                    x: x,
                    y: y
                }
            }
                
            return {
                update: update,
                x: x,
                y: y
            }
        }
    }
});