define(['input', 'models/movement'], function(input, movement) {
    var speed = 0.0016; // Squares per millisecond
    var movingTo = null;

    return {
        init: function(grid) {
            var update = function(dt) {
                if (movingTo) {
                    state.x = movement.tween(state.x, movingTo[0], dt * speed);
                    state.y = movement.tween(state.y, movingTo[1], dt * speed);
                    if (state.x === movingTo[0] && state.y === movingTo[1]) {
                        movingTo = null;
                    }
                } else if (input.getDirection() !== null) {
                    var move = movement.directionVector(input.getDirection());
                    var moveTo = [state.x + move[0], state.y + move[1]];
                    if (grid.isValidPosition(moveTo)) {
                        grid.notifyPlayerMove([state.x, state.y], moveTo, 1 / speed);
                        movingTo = moveTo;
                    }
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