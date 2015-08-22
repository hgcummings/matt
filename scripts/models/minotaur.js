define(['input', 'models/movement'], function(input, movement) {
    var speed = 0.0016; // Squares per millisecond
    var target = null;

    return {
        init: function(grid) {
            var update = function(dt) {
                if (target) {
                    state.x = movement.tween(state.x, target[0], dt * speed);
                    state.y = movement.tween(state.y, target[1], dt * speed);
                    if (state.x === target[0] && state.y === target[1]) {
                        target = null;
                    }
                } else if (input.getDirection() !== null) {
                    switch(input.getDirection()) {
                        case 0:
                            target = [state.x, state.y - 1];
                            break;
                        case 1:
                            target = [state.x + 1, state.y];
                            break;
                        case 2:
                            target = [state.x, state.y + 1];
                            break;
                        case 3:
                            target = [state.x - 1, state.y];
                            break;
                    }
                    grid.notifyPlayerMove([state.x, state.y], target, 1 / speed);
                }
            }
            
            var state = {
                update: update,
                x: grid.width / 2,
                y: grid.height / 2
            }
                
            return state;
        }
    }
});