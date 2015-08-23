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
            
            var updateEnemyProbabilities = function() {
                var newP = [];
                for (var i = 0; i < grid.width; ++i) {
                    newP[i] = [];
                    for (var j = 0; j < grid.width; ++j) {
                        newP[i][j] = enemyP[i][j] / 5;
                        if (i > 0) { newP[i][j] += enemyP[i - 1][j] / 5; }
                        if (i < grid.width - 1) { newP[i][j] += enemyP[i + 1][j] / 5; }
                        if (j > 0) { newP[i][j] += enemyP[i][j - 1] / 5; }
                        if (j < grid.height - 1) { newP[i][j] += enemyP[i][j + 1] / 5; }
                    }
                }
                if (window.DEBUG_PROBABILITIES) {
                    window.DEBUG_PROBABILITIES = newP;
                }
                enemyP = newP;
            }
            
            var resetEnemyProbabilities = function(x, y) {
                for (var i = 0; i < grid.width; ++i) {
                    for (var j = 0; j < grid.width; ++j) {
                        enemyP[i][j] = 0;
                    }
                }
                enemyP[Math.floor(x)][Math.floor(y)] = 1;
                target = [Math.floor(x), Math.floor(y)];
            }
            
            var clearEnemyProbability = function(x, y) {
                if (grid.isValidPosition([x, y])) {
                    enemyP[Math.floor(x)][Math.floor(y)] = 0;
                }
            }
            
            var soundListener = environment.createSoundListener(state.x, state.y, resetEnemyProbabilities);

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
            
            var timeSinceLastLocated = 0;
            
            state.update = function(dt) {
                paths.update(lightSource, dt);
                soundListener.updatePosition(state.x, state.y);
                if (movingTo) {
                    state.x = movement.tween(state.x, movingTo[0], dt * speed());
                    state.y = movement.tween(state.y, movingTo[1], dt * speed());
                    lightSource.updatePosition(state.x, state.y);
                    if (state.x === movingTo[0] && state.y === movingTo[1]) {
                        movingTo = null;
                    }
                }
                
                if (lightSource.visibleEntities.length) {
                    resetEnemyProbabilities(lightSource.visibleEntities[0].x, lightSource.visibleEntities[0].y);
                } else {
                    for (var i = 0; i < lightSource.lightCells.length; ++i) {
                        var cell = lightSource.lightCells[i];
                        clearEnemyProbability(cell.x, cell.y);
                    }
                }
                
                if (!movingTo) {
                    if (target) {
                        if (state.x === target[0] + 0.5 && state.y === target[1] + 0.5) {
                            target = null;
                        }                        
                    }
                    if (!target) {
                        target = chooseNewTarget();
                    }
                    movingTo = paths.moveTo(target, [state.x, state.y]);
                    if (movingTo) {
                        obstructed = !!grid.notifyPlayerMove(
                            [state.x, state.y], movingTo, 1 / difficulty.theseusWallMoveSpeed);
                    }
                }
                
                if (Math.floor((timeSinceLastLocated + dt) * difficulty.minotaurSpeed) >
                    Math.floor(timeSinceLastLocated * difficulty.minotaurSpeed)) {
                    updateEnemyProbabilities();
                }
                timeSinceLastLocated += dt;
            };
            return state;
        }
    };
});