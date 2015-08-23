define(['models/movement', 'lodash'], function(movement, _) {    
    var blocked = {
        NS: [],
        WE: []
    }
    var decay = 0.00005;
        
    var constrainToGrid = function(point) {
        return [Math.floor(point[0]), Math.floor(point[1])];
    }
    
    var normalisePath = function(path) {
        var orientation = path[0][0] === path[1][0] ? 'NS' : 'WE';
        
        if (path[0][0] > path[1][0] || path[0][1] > path[1][1]) {
            return {
                start: constrainToGrid(path[1]),
                orientation: orientation
            }
        } else {
            return {
                start: constrainToGrid(path[0]),
                orientation: orientation
            }
        }
    }
    
    return {
        init: function(difficulty, grid) {
            function isInGrid(path) {
                return grid.isValidPosition(path.start) && grid.isValidPosition([
                    path.orientation === 'WE' ? path.start[0] + 1 : path.start[0],
                    path.orientation === 'NS' ? path.start[1] + 1 : path.start[1]
                ])
            }
            
            for (var i = 0; i < grid.width; ++i) {
                blocked.NS[i] = [];
                blocked.WE[i] = [];
                for (var j = 0; j < grid.height; ++j) {
                    if (isInGrid({start: [i, j], orientation: 'NS'})) {
                        blocked.NS[i][j] = difficulty.mazeDensity;
                    }
                    if (isInGrid({start: [i, j], orientation: 'WE'})) {
                        blocked.WE[i][j] = difficulty.mazeDensity;
                    }
                }
            }
    
            var lookupBlocked = function (path) {
                return blocked[path.orientation][path.start[0]][path.start[1]];
            }
    
            var updatedBlocked = function(path, value) {
                if (isInGrid(path)) {
                    blocked[path.orientation][path.start[0]][path.start[1]] = value;
                }
            }
            
            return {
                moveTo: function(target, start) {
                    var cameFrom = {};
                    
                    var unblockedStepCost = 1 / difficulty.theseusSpeed;
                    var blockedStepAdditionalCost = (1 / difficulty.theseusWallMoveSpeed) - unblockedStepCost;

                    var stepCost = function(blockedEstimate) {
                        return unblockedStepCost + (blockedStepAdditionalCost * blockedEstimate);
                    }
                    
                    var estimatedCost = function(fromPoint, toPoint) {
                        return Math.abs(fromPoint[0] - toPoint[0]) + Math.abs(fromPoint[1] - toPoint[1]);
                    }
                    
                    var reconstructPath = function(current) {
                        var totalPath = [current];
                        while (cameFrom.hasOwnProperty(current)) {
                            current = cameFrom[current];
                            totalPath.unshift(current);
                        }
                        if (window.DEBUG_PATHS_ENABLED) {
                            window.DEBUG_FOUND_PATH = totalPath;
                        } else {
                            delete window.DEBUG_FOUND_PATH;
                        }
                        if (totalPath.length > 1) {
                            return [totalPath[1][0] + 0.5, totalPath[1][1] + 0.5];
                        } else {
                            return null;
                        }
                    }
                    
                    var contains = function(collection, point) {
                        return _.any(collection, function(candidate) {
                            return candidate[0] === point[0] && candidate[1] === point[1];
                        });
                    }
                    
                    start = constrainToGrid(start);
                    var closed = [];
                    var open = [start];
                    var scores = { f: {}, g: {} };
                    
                    var setScore = function(point, score, value) {
                        scores[score][point.toString()] = value;
                    }
                    
                    var getScore = function(point, score) {
                        if (scores[score].hasOwnProperty(point.toString())) {
                            return scores[score][point.toString()];
                        }
                        return Infinity;
                    }
                    
                    var getFScore = function(point) {
                        return getScore(point, 'f');
                    }
                    
                    setScore(start, 'g', 0);
                    setScore(start, 'f', estimatedCost(start, target));
                    
                    while (open.length) {
                        var current = _.min(open, getFScore);
                        
                        if (_.eq(current, target)) {
                            return reconstructPath(target)
                        }
                        
                        open.splice(open.indexOf(current), 1);
                        closed.push(current);
                        
                        for (var d = 0; d < 4; ++d) {
                            var move = movement.directionVector(d);
                            var neighbour = [current[0] + move[0], current[1] + move[1]];
                            
                            if (contains(closed, neighbour) || !grid.isValidPosition(neighbour)) {
                                continue;
                            }
                            
                            var tentativeGScore = getScore(current, 'g') +
                                stepCost(lookupBlocked(normalisePath([current, neighbour])));
                            console.log(tentativeGScore);
                            
                            if (!contains(open, neighbour) || tentativeGScore < getScore(neighbour, 'g'))
                            {
                                cameFrom[neighbour.toString()] = current;
                                setScore(neighbour, 'g', tentativeGScore);
                                setScore(neighbour, 'f', tentativeGScore + estimatedCost(neighbour, target));
                                if (!contains(open, neighbour)) {
                                    open.push(neighbour);
                                }
                            }
                        }
                    }
                },
                update: function(pathInfo, dt) {
                    for (var i = 0; i < grid.width; ++i) {
                        for (var j = 0; j < grid.height; ++j) {
                            blocked.NS[i][j] = movement.tween(
                                blocked.NS[i][j], difficulty.mazeDensity, dt * decay);
                            blocked.WE[i][j] = movement.tween(
                                blocked.WE[i][j], difficulty.mazeDensity, dt * decay);
                        }
                    }
                    
                    pathInfo.blockedPaths.forEach(function(path) {
                        updatedBlocked(normalisePath(path), 1);
                    });
                    pathInfo.clearPaths.forEach(function(path) {
                        updatedBlocked(normalisePath(path), 0);
                    });
                    if (window.DEBUG_PATHS_ENABLED) {
                        window.DEBUG_BLOCKED_PATHS = blocked;
                    } else {
                        delete window.DEBUG_BLOCKED_PATHS;
                    }
                }
            }
        }
    }
    
})