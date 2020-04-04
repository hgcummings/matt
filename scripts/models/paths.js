define(['models/movement', 'lodash'], function(movement, _) {   
    'use strict';
    
    var costs = {
        NS: [],
        WE: []
    };
    var decay = 0.00005;
        
    var constrainToGrid = function(point) {
        return [Math.floor(point[0]), Math.floor(point[1])];
    };
    
    var normalisePath = function(path) {
        var orientation = path[0][0] === path[1][0] ? 'NS' : 'WE';
        
        if (path[0][0] > path[1][0] || path[0][1] > path[1][1]) {
            return {
                start: constrainToGrid(path[1]),
                orientation: orientation
            };
        } else {
            return {
                start: constrainToGrid(path[0]),
                orientation: orientation
            };
        }
    };
    
    return {
        init: function(difficulty, grid) {
            // Cost of moving from one square to the next
            var blockedCost = 1 / difficulty.theseusWallMoveSpeed;
            var unblockedCost = 1 /difficulty.theseusSpeed;
            
            /*Expected cost is a bit complicated to calculate. Importantly though, it is *not* simply an average of the
              two numbers above weighted by the maze density 'd', because there's usually a better option than powering
              through a solid wall. The actual expected cost (with 'u' referring to cost of an unblocked step) is:
                (u * probability of getting straight through) +
                (3u * probability of getting around one side or the other) +
                (5u * probability of making a five-step detour) +
                (7u * probability of making a seven-step detour) +
                (... and so on until the cost is greater than stepping through a blocked wall, 'b')
                (b * the remaining probability)
              For the middle terms, we are effectively walking around a wall with two possibilities for where
              the first segment is placed (to the left or right of the one in front of us) and three possibilties
              for each subsequent segment (carrying on straight, turning left or right), which gives:
                   3u * 2(1-d)^3, 5u * 2*3(1-d)^5, 7u * 2*9(1-d)^7, etc...*/
            var cumulativeProbability = (1 - difficulty.mazeDensity);
            var expectedCost = unblockedCost * cumulativeProbability;
            for (var n = 3; n * unblockedCost < blockedCost; n += 2) {
                var probability = 2 * Math.pow(3, ((n - 1) / 2) - 1) * Math.pow(1 - difficulty.mazeDensity, n);
                expectedCost += n * unblockedCost * probability;
                cumulativeProbability += probability;
            }
            expectedCost += (1-cumulativeProbability) * blockedCost;
    
            function isInGrid(path) {
                return grid.isValidPosition(path.start) && grid.isValidPosition([
                    path.orientation === 'WE' ? path.start[0] + 1 : path.start[0],
                    path.orientation === 'NS' ? path.start[1] + 1 : path.start[1]
                ]);
            }
            
            for (var i = 0; i < grid.width; ++i) {
                costs.NS[i] = [];
                costs.WE[i] = [];
                for (var j = 0; j < grid.height; ++j) {
                    if (isInGrid({start: [i, j], orientation: 'NS'})) {
                        costs.NS[i][j] = expectedCost;
                    }
                    if (isInGrid({start: [i, j], orientation: 'WE'})) {
                        costs.WE[i][j] = expectedCost;
                    }
                }
            }
    
            var lookupCost = function (path) {
                return costs[path.orientation][path.start[0]][path.start[1]];
            };
    
            var updatedCost = function(path, value) {
                if (isInGrid(path)) {
                    costs[path.orientation][path.start[0]][path.start[1]] = value;
                }
            };
            
            return {
                moveTowards: function(target, start) {
                    var cameFrom = {};
                    
                    var estimatedCost = function(fromPoint, toPoint) {
                        var steps = Math.abs(fromPoint[0] - toPoint[0]) + Math.abs(fromPoint[1] - toPoint[1]);
                        return unblockedCost * steps;
                    };
                    
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
                    };
                    
                    var contains = function(collection, point) {
                        return _.any(collection, function(candidate) {
                            return candidate[0] === point[0] && candidate[1] === point[1];
                        });
                    };
                    
                    start = constrainToGrid(start);
                    var closed = [];
                    var open = [start];
                    var scores = { f: {}, g: {} };
                    
                    var setScore = function(point, score, value) {
                        scores[score][point.toString()] = value;
                    };
                    
                    var getScore = function(point, score) {
                        if (scores[score].hasOwnProperty(point.toString())) {
                            return scores[score][point.toString()];
                        }
                        return Infinity;
                    };
                    
                    var getFScore = function(point) {
                        return getScore(point, 'f');
                    };
                    
                    setScore(start, 'g', 0);
                    setScore(start, 'f', estimatedCost(start, target));
                    
                    while (open.length) {
                        var current = _.min(open, getFScore);
                        
                        if (_.eq(current, target)) {
                            return reconstructPath(target);
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
                                (lookupCost(normalisePath([current, neighbour])));
                            
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
                            costs.NS[i][j] = movement.tween(
                                costs.NS[i][j], expectedCost, dt * decay);
                            costs.WE[i][j] = movement.tween(
                                costs.WE[i][j], expectedCost, dt * decay);
                        }
                    }
                    
                    pathInfo.blockedPaths.forEach(function(path) {
                        updatedCost(normalisePath(path), blockedCost);
                    });
                    pathInfo.clearPaths.forEach(function(path) {
                        updatedCost(normalisePath(path), unblockedCost);
                    });
                    if (window.DEBUG_PATHS_ENABLED) {
                        window.DEBUG_PATH_COSTS = costs;
                    } else {
                        delete window.DEBUG_PATH_COSTS;
                    }
                }
            };
        }
    };
    
});
