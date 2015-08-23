define(['input', 'models/movement'], function(input, movement) {
    'use strict';
    //var target = null;
    var movingTo = null;
    var obstructed = false;
    
    var blockNsP = []; // Confidence that a North-Source path is blocked
    var blockWeP = []; // Confidence that an East-West path is blocked
    var enemyP = []; // Confidence of the location of the enemy

    return {
        init: function(difficulty, grid, environment) {
            for (var i = 0; i < grid.width; ++i) {
                blockNsP[i] = [];
                blockWeP[i] = [];
                enemyP[i] = [];
                for (var j = 0; j < grid.width; ++j) {
                    blockNsP[i][j] = 0;
                    blockWeP[i][j] = 0;
                    enemyP[i][j] = 0;
                }
            }
            enemyP[Math.floor(grid.width / 2)][Math.floor(grid.height / 2)] = 1;
            
            var state = {
                x: grid.width / 2,
                y: 0.5
            };
            var lightSource = environment.createLightSource(state.x, state.y);
            
            var speed = function() {
                return obstructed ? difficulty.theseusWallMoveSpeed : difficulty.theseusSpeed;
            };
            
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
            };
            return state;
        }
    };
});