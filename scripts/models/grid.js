define(['lodash'], function(_) {
    var width = 18;
    var height = 18;
    
    function generatePillars() {        
        var pillars = [];
        
        for (var i = 1; i < width; i += 1) {
            for (var j = 1; j < width; j += 1) {
                if (i % 2 !== j % 2) {
                    continue;
                }
                var walls = [];
                for (var k = 0; k < 4; ++k) {
                    if (Math.random() > 0.5) {
                        walls.push(k);
                    }
                }
                if (walls.length) {
                    pillars.push({
                        x: i,
                        y: j,
                        walls: walls
                    });
                }
            }
        }
        
        return pillars;
    }
    
    return {
        init: function() {
            var pillars = generatePillars();
            
            var update = function() {
                
            }
            
            var notifyPlayerMove = function() {
                
            }
            
            var state = {
                update: update,
                width: width,
                height: height,
                pillars: pillars,
                notifyPlayerMove: notifyPlayerMove 
            };
            
            return state;
        }
    }
})