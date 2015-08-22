define(['lodash'], function(_) {
    var width = 18;
    var height = 18;
    
    function generatePillars() {
        var getWall = function() {
            return Math.max(0, Math.floor(Math.random() * 4) - 1);
        }
        
        var pillars = [];
        
        var addWallToPillar = function(x, y, d) {
            var existingPillar = _.find(pillars, function(pillar) {
                return pillar.x === x && pillar.y === y;
            });
            if (existingPillar) {
                existingPillar.walls.push(d);
            } else {
                pillars.push({
                    x: x,
                    y: y,
                    walls: [d]
                });
            }
        }
        
        for (var i = 0; i < width; ++i) {
            for (var j = 0; j < height; ++j) {
                if (i > 0) {
                    var vertical = getWall();
                    if (vertical) {
                        addWallToPillar(i, j + vertical - 1, (2 - vertical) * 2);
                    }
                }
                if (j > 0) {
                    var horizontal = getWall();
                    if (horizontal) {
                        addWallToPillar(i + horizontal - 1, j, (2 * horizontal) - 1);
                    }
                }
            }
        }
        
        return pillars;
    }
    
    return {
        init: function() {
            var pillars = generatePillars();
            
            return {
                width: width,
                height: height,
                pillars: pillars
            }
        }
    }
})