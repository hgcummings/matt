define(['models/movement', 'models/geometry'], function(movement, geometry) {
    return {        
        init: function() {
            var state = {
                lightSources: [],
                soundSources: [],
                soundListeners: []
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
            
            var speedOfSound = 0.1; // Squares per millisecond
            
            function SoundSource(x, y, v) {
                this.x = x;
                this.y = y;
                this.v = v;
                this.r = 0;
            }
            
            SoundSource.prototype.update = function(dt) {
                var newR = Math.min(this.v, this.r + speedOfSound);
                for (var i = 0; i < state.soundListeners.length; ++i) {
                    var listener = state.soundListeners[i];
                    var distanceSquared = (
                        (listener.x - this.x) * (listener.x - this.x) + 
                        (listener.y - this.y) * (listener.y - this.y));
                    if (distanceSquared > (this.r * this.r) && distanceSquared <= (newR * newR)) {
                        listener.notify(this.x, this.y);
                    }
                }
                this.r = newR;
            }
            
            SoundSource.prototype.active = function() {
                return this.r < this.v;
            }
            
            function SoundListener(x, y, callback) {
                this.updatePosition(x, y);
                this.watchers = [];
                this.callback = callback;
            }
            
            SoundListener.prototype.updatePosition = function (x, y) {
                this.x = x;
                this.y = y;
            }
            
            SoundListener.prototype.notify = function(sourceX, sourceY) {
                this.callback(sourceX, sourceY);
            }
            
            state.createLightSource = function(x, y) {
                var lightSource = new LightSource(x, y);
                state.lightSources.push(lightSource);
                return lightSource;
            };
            state.registerObstructions = function(pillars) {
                obstructions = pillars;
            };
            state.createSoundListener = function(x, y, callback) {
                var soundListener = new SoundListener(x, y, callback);
                state.soundListeners.push(soundListener);
                return soundListener;
            },
            state.notifyAudible = function(x, y, v) {
                state.soundSources.push(new SoundSource(x, y, v));
            };
            state.notifyVisible = function(x, y) {
                for (var i = 0; i < state.lightSources.length; ++i) {
                    state.lightSources[i].notify(x, y);
                }
            };
            state.update = function(dt) {
                for (var i = state.soundSources.length - 1; i >= 0; --i) {
                    var soundSource = state.soundSources[i];
                    if (soundSource.active()) {
                        soundSource.update(dt);
                    } else {
                        state.soundSources.splice(i, 1);
                    }
                }
            };
            return state;
        }
    }
});