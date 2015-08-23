define(['input', 'models/movement', 'models/paths', 'lodash'], function(input, movement, pathsModel, _) {
    'use strict';
    var target = null;
    var movingTo = null;
    var obstructed = false;
    
    var paths;
    var enemyP = []; // Confidence of the location of the enemy

    return {
        init: function(difficulty, grid, environment) {
            paths = pathsModel.init(difficulty, grid);
            for (var i = 0; i < grid.width; ++i) {
                enemyP[i] = [];
                for (var j = 0; j < grid.width; ++j) {
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

            var chooseNewTarget = function() {
                var max = 0;
                var maxTargets = [];
                
                for (var i = 0; i < grid.width; ++i) {
                    for (var j = 0; j < grid.width; ++j) {
                        var value = enemyP[i][j];
                        if (value > max) {
                            max = value;
                            maxTargets = [];
                        }
                        if (value === max) {
                            maxTargets.push([i, j]);
                        }
                    }
                }
                
                if (maxTargets.length === 1) {
                    return maxTargets[0];
                } else {
                    return _.sample(maxTargets);
                }
            }
            
            state.update = function(dt) {
                paths.update(lightSource, dt);
                if (movingTo) {
                    state.x = movement.tween(state.x, movingTo[0], dt * speed());
                    state.y = movement.tween(state.y, movingTo[1], dt * speed());
                    lightSource.updatePosition(state.x, state.y);
                    if (state.x === movingTo[0] && state.y === movingTo[1]) {
                        movingTo = null;
                    }
                } else {
                    if (!target) {
                        target = chooseNewTarget();
                    }
                    movingTo = paths.moveTo(target, [state.x, state.y]);
                    if (movingTo) {
                        obstructed = !!grid.notifyPlayerMove(
                            [state.x, state.y], movingTo, 1 / difficulty.theseusWallMoveSpeed);
                    }
                }
            };
            return state;
        }
    };
});