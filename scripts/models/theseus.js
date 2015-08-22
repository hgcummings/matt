define(['input', 'models/movement'], function(input, movement) {
    var speed = 0.0032; // Squares per millisecond
    var wallMovingSpeed = 0.0004;
    var target = null;
    var movingTo = null;

    return {
        init: function(grid, environment) {
            var state = {
                x: grid.width / 2,
                y: 0.5
            };
            var lightSource = environment.createLightSource(state.x, state.y);
            
            state.update = function(dt) {
                if (movingTo) {
                    state.x = movement.tween(state.x, movingTo[0], dt * speed);
                    state.y = movement.tween(state.y, movingTo[1], dt * speed);
                    lightSource.updatePosition(state.x, state.y);
                    if (state.x === movingTo[0] && state.y === movingTo[1]) {
                        movingTo = null;
                    //    lightSource.updatePosition(state.x, state.y);
                    }
                } else {
                    var direction = Math.floor(Math.random() * 4);
                    var move = movement.directionVector(direction);
                    var moveTo = [state.x + move[0], state.y + move[1]];
                    if (grid.isValidPosition(moveTo)) {
                        movingTo = moveTo;
                    }
                }
            }
            return state;
        }
    }
});