define(['models/movement', 'models/geometry', 'views/hint'], function(movement, geometry, hintView) {
    'use strict';
    return {        
        init: function() {
            var state = {
                lightSources: [],
                soundSources: [],
                soundListeners: [],
                visibleEntities: {}
            };
            var obstructions = [];
            
            function LightSource(x, y) {
                this.updatePosition(x, y);
                this.watchers = [];
                this.visibleEntities = [];
            }
            
            LightSource.prototype.updatePosition = function(x, y) {
                this.x = x;
                this.y = y;
                this.lightCells = [{x: this.x, y: this.y, lum: 1}];
                this.blockedPaths = [];
                this.clearPaths = [];
                
                for (var lum = 0.75; lum > 0; lum -= 0.25) {
                    var currentCells = this.lightCells.length;
                    for (var i = 0; i < currentCells; ++i) {
                        var cell = this.lightCells[i];
                        for (var d = 0; d < 4; ++d) {
                            var move = movement.directionVector(d);
                            var newPosition = [cell.x + move[0], cell.y + move[1]];
                            if (geometry.findObstruction(obstructions, [cell.x, cell.y], newPosition)) {
                                this.blockedPaths.push([[cell.x, cell.y], newPosition]);
                            } else {
                                this.clearPaths.push([[cell.x, cell.y], newPosition]);
                                if (!this.illuminatesPosition(newPosition[0], newPosition[1])) {
                                    this.lightCells.push({x: newPosition[0], y: newPosition[1], lum: lum});
                                }
                            }
                        }
                    }
                }
                
                this.visibleEntities = [];
                for (var key in state.visibleEntities) {
                    if (state.visibleEntities.hasOwnProperty(key)) {
                        var entity = state.visibleEntities[key];
                        if (this.illuminatesPosition(entity.x, entity.y)) {
                            this.visibleEntities.push(entity);
                        }
                    }
                }
            };
            
            LightSource.prototype.illuminatesPosition = function(x, y) {
                for (var i = 0; i < this.lightCells.length; ++i) {
                    var cell = this.lightCells[i];
                    if (cell.x - 0.5 <= x && x <= cell.x + 0.5 && cell.y - 0.5 <= y && y <= cell.y + 0.5) {
                        return true;
                    }
                }
                return false;
            };
            
            LightSource.prototype.deactivate = function() {
                var index = state.lightSources.indexOf(this);
                if (index !== -1) {
                    state.lightSources.splice(index, 1);
                }
            };
            
            var speedOfSound = 0.01; // Squares per millisecond
            
            function SoundSource(x, y, v) {
                this.x = x;
                this.y = y;
                this.v = v;
                this.r = 0;
            }
            
            SoundSource.prototype.update = function(dt) {
                var newR = Math.min(this.v, this.r + speedOfSound * dt);
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
            };
            
            SoundSource.prototype.active = function() {
                return this.r < this.v;
            };
            
            function SoundListener(x, y, callback) {
                this.updatePosition(x, y);
                this.watchers = [];
                this.callback = callback;
            }
            
            SoundListener.prototype.updatePosition = function (x, y) {
                this.x = x;
                this.y = y;
            };
            
            SoundListener.prototype.notify = function(sourceX, sourceY) {
                hintView.setText('Be careful! If Theseus hears you it will help him track you down...', 'danger');
                this.callback(sourceX, sourceY);
            };
            
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
            };
            state.notifyAudible = function(x, y, v) {
                state.soundSources.push(new SoundSource(x, y, v));
            };
            state.registerVisibleEntity = function(key, entity) {
                state.visibleEntities[key] = entity;
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
    };
});