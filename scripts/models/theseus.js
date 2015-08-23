define(['input', 'models/movement'], function(input, movement) {
    var target = null;
    var movingTo = null;
    var obstructed = false;

    return {
        init: function(difficulty, grid, environment) {
            var state = {
                x: grid.width / 2,
                y: 0.5
            };
            var lightSource = environment.createLightSource(state.x, state.y);
            
            var speed = function() {
                return obstructed ? difficulty.theseusWallMoveSpeed : difficulty.theseusSpeed;
            }
            
            state.update = function(dt) {
                if (movingTo) {
                    state.x = movement.tween(state.x, movingTo[0], dt * speed());
                    state.y = movement.tween(state.y, movingTo[1], dt * speed());
                    lightSource.updatePosition(state.x, state.y);
                    if (state.x === movingTo[0] && state.y === movingTo[1]) {
                        movingTo = null;
                    }
                } else {
                    var direction = Math.floor(Math.random() * 4);
                    var move = movement.directionVector(direction);
                    var moveTo = [state.x + move[0], state.y + move[1]];
                    if (grid.isValidPosition(moveTo)) {
                        obstructed = !!grid.notifyPlayerMove(
                            [state.x, state.y], moveTo, 1 /  difficulty.theseusWallMoveSpeed);
                        movingTo = moveTo;
                    }
                }
            }
            return state;
        }
    }
});