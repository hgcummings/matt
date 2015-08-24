define(['input', 'models/movement', 'audio'], function(input, movement, audio) {
    'use strict';
    var movingTo = null;

    return {
        init: function(difficulty, grid, environment) {
            var update = function(dt) {
                if (movingTo) {
                    state.x = movement.tween(state.x, movingTo[0], dt * difficulty.minotaurSpeed);
                    state.y = movement.tween(state.y, movingTo[1], dt * difficulty.minotaurSpeed);
                    if (state.x === movingTo[0] && state.y === movingTo[1]) {
                        movingTo = null;
                    }
                } else if (input.getDirection() !== null) {
                    state.d = input.getDirection();
                    var move = movement.directionVector(state.d);
                    var moveTo = [state.x + move[0], state.y + move[1]];
                    if (grid.isValidPosition(moveTo)) {
                        var obstruction = grid.notifyPlayerMove(
                            [state.x, state.y], moveTo, 1 / difficulty.minotaurSpeed);
                        if (obstruction) {
                            environment.notifyAudible(obstruction.x, obstruction.y, difficulty.wallMoveVolume);
                            audio.wall();
                        } else {
                            environment.notifyAudible(state.x, state.y, difficulty.footstepVolume);
                            audio.step();
                        }
                        movingTo = moveTo;
                    }
                }
            };
            
            var state = {
                update: update,
                x: grid.width / 2,
                y: grid.height / 2,
                d: 0
            };
            
            environment.registerVisibleEntity('minotaur', state);
                
            return state;
        }
    };
});