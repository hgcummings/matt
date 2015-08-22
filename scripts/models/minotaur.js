define(['input', 'models/movement'], function(input, movement) {
    var speed = 0.0015; // Squares per millisecond
    var target = null;

    return {
        init: function(grid) {
            var x = grid.width / 2;
            var y = grid.height / 2;
            var update = function(dt) {
                if (target) {
                    x = movement.tween(x, target[0], dt * speed);
                    y = movement.tween(y, target[1], dt * speed);
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
                    grid.notifyPlayerMove([x, y], target, 1 / speed);
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