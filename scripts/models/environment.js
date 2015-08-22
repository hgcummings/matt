define(['models/movement', 'models/geometry'], function(movement, geometry) {
    return {        
        init: function() {
            var state = {
                lightSources: [],
                soundSources: []
            }
            var obstructions = [];
            
            function LightSource(x, y) {
                this.updatePosition(x, y);
                this.watchers = [];
            }
            
            LightSource.prototype.updatePosition = function(x, y) {
                this.x = x;
                this.y = y;
                this.lightCells = [];
                this.lightCells.push({x: this.x, y: this.y, lum: 1});
                
                for (var lum = 0.75; lum > 0; lum -= 0.25) {
                    var currentCells = this.lightCells.length;
                    for (var i = 0; i < currentCells; ++i) {
                        var cell = this.lightCells[i];
                        for (var d = 0; d < 4; ++d) {
                            var move = movement.directionVector(d);
                            var newPosition = [cell.x + move[0], cell.y + move[1]];
                            if (!this.illuminatesPosition(newPosition[0], newPosition[1]) &&
                                 !geometry.findObstruction(obstructions, [cell.x, cell.y], newPosition)) {
                                this.lightCells.push({x: newPosition[0], y: newPosition[1], lum: lum});
                            }
                        }
                    }
                }
            }
            
            LightSource.prototype.illuminatesPosition = function(x, y) {
                for (var i = 0; i < this.lightCells.length; ++i) {
                    if (Math.round(this.lightCells[i].x * 2) / 2 === Math.round(x * 2) / 2 &&
                        Math.round(this.lightCells[i].y * 2) / 2 === Math.round(y * 2) / 2) {
                        return true;
                    }
                }
                return false;
            }
            
            LightSource.prototype.notify = function(x, y) {
                if (this.illuminatesPosition(x, y)) {
                    for (var i = 0; i < this.watchers.length; ++i) {
                        this.watchers[i].notify(x, y);
                    }
                }
            }
            
            LightSource.prototype.watch = function(callback) {
                this.watchers.push(callback);
            }
            
            state.createLightSource = function(x, y) {
                var lightSource = new LightSource(x, y);
                state.lightSources.push(lightSource);
                return lightSource;
            };
            state.registerObstructions = function(pillars) {
                obstructions = pillars;
            };
            state.notifyAudible = function(x, y, v) {
                    
            };
            state.notifyVisible =function(x, y) {
                    
            };
            state.update = function(dt) {
                    
            };
            return state;
        }
    }
});