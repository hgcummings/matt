define(['models/movement'], function(movement) {    
    var blocked = {
        NS: [],
        WE: []
    }
    var decay = 0.00005;
    
    var normalisePath = function(path) {
        var orientation = path[0][0] === path[1][0] ? 'NS' : 'WE';
        
        var constrainToGrid = function(point) {
            return [Math.floor(point[0]), Math.floor(point[1])];
        }
        
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
    
            var updatedBlocked = function(path, value) {
                if (isInGrid(path)) {
                    blocked[path.orientation][path.start[0]][path.start[1]] = value;
                }
            }
            
            return {
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