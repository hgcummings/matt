define(['models/geometry', 'models/movement'], function(geometry, movement) {
    var width = 19;
    var height = 19;
    
    function generatePillars() {
        var pillars = [];
        
        function Pillar(x, y, wallDirections) {
            this.x = x;
            this.y = y;
            this.wallDirections = wallDirections;
            this.recalculateWalls();
        }
        
        Pillar.prototype.recalculateWalls = function() {
            var round = function(value) {
                return Math.round(value * 1000) / 1000;
            }
            
            this.walls = this.wallDirections.map(function(wallDirection) {
                var angle = wallDirection * Math.PI / 2;
                return [this.x + round(Math.sin(angle)), this.y - round(Math.cos(angle))];
            }.bind(this))
        }
        
        Pillar.prototype.rotate = function(direction, duration) {
            this.rotationDuration = duration;
            this.targetWallDirections = this.wallDirections.map(function(wallDirection) {
                return wallDirection + direction;
            });
        }
        
        Pillar.prototype.update = function(dt) {
            this.wallDirections = this.wallDirections.map(function(wallDirection, index) {
                return movement.tween(
                    wallDirection, this.targetWallDirections[index], dt / this.rotationDuration);
            }.bind(this))
            this.recalculateWalls();
            if (this.wallDirections[0] === this.targetWallDirections[0]) {
                delete this.rotationDuration;
                delete this.targetWallDirections;
                return false;
            }
            return true;
        }
        
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
                    pillars.push(new Pillar(i, j, walls));
                }
            }
        }
        
        return pillars;
    }
    
    return {
        init: function() {
            var pillars = generatePillars();
            var activePillar;
            var update = function(dt) {
                if (activePillar) {
                    activePillar = activePillar.update(dt) ? activePillar : null;
                }
            }
            
            var notifyPlayerMove = function(start, end, duration) {
                for (var i = 0; i < pillars.length; ++i) {
                    var pillar = pillars[i];
                    for (var j = 0; j < pillar.walls.length; ++j) {
                        var direction = geometry.crosses([start, end], [[pillar.x, pillar.y], pillar.walls[j]]);
                        if (direction) {
                            break;
                        }
                    }
                    if (direction) {
                        activePillar = pillar;
                        pillar.rotate(direction, duration);
                    }
                }
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