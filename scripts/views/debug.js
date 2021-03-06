define(['views/globals'], function(viewGlobals) {
    'use strict';
    return {
        draw: function(context) {
            var drawPaths = function(paths, direction) {
                for (var i = 0; i < paths.length; ++i) {
                    for (var j = 0; j < paths[i].length; ++j) {
                        var blocked = paths[i][j];
                        if (isNaN(blocked)) {
                            continue;
                        }
                        var start = [i + 0.5, j + 0.5];
                        context.save();
                        
                        context.globalAlpha = 0.5;
                        context.strokeStyle =
                         'rgb(' + Math.round(255 * blocked) + ',' + Math.round(255 * (1-blocked)) + ', 0)';
                        context.beginPath();
                        context.moveTo(start[0] * viewGlobals.scale, start[1] * viewGlobals.scale);
                        context.lineTo(
                            (start[0] + direction[0]) * viewGlobals.scale,
                            (start[1] + direction[1]) * viewGlobals.scale);
                        context.stroke();
                        context.closePath();
                        context.restore();

                    }
                }
            };
            
            if (window.DEBUG_BLOCKED_PATHS) {
                drawPaths(window.DEBUG_BLOCKED_PATHS.NS, [0, 1]);
                drawPaths(window.DEBUG_BLOCKED_PATHS.WE, [1, 0]);
            }

            var drawFoundPath = function() {
                for (var i = 0; i < window.DEBUG_FOUND_PATH.length - 1; ++i) {
                    var start = window.DEBUG_FOUND_PATH[i];
                    var end = window.DEBUG_FOUND_PATH[i + 1];
                    context.save();
                    context.globalAlpha = 0.5;
                    context.strokeStyle = '#fff';
                    context.beginPath();
                    context.moveTo((start[0] + 0.5) * viewGlobals.scale, (start[1] + 0.5) * viewGlobals.scale);
                    context.lineTo((end[0] + 0.5) * viewGlobals.scale, (end[1] + 0.5) * viewGlobals.scale);
                    context.stroke();
                    context.closePath();
                    context.restore();
                }
            };
            
            if (window.DEBUG_FOUND_PATH) {
                drawFoundPath();
            }
            
            if (window.DEBUG_PROBABILITIES) {
                var max = 0;
                
                for (var im = 0; im < window.DEBUG_PROBABILITIES.length; ++im) {
                    for (var jm = 0; jm < window.DEBUG_PROBABILITIES[im].length; ++jm) {
                        max = Math.max(max, window.DEBUG_PROBABILITIES[im][jm]);
                    }
                }
                
                if (max > 0) {
                    for (var i = 0; i < window.DEBUG_PROBABILITIES.length; ++i) {
                        for (var j = 0; j < window.DEBUG_PROBABILITIES[i].length; ++j) {
                            context.save();
                            context.globalAlpha = Math.min(1, window.DEBUG_PROBABILITIES[i][j] / max);
                            context.fillStyle = '#a52a2a';
                            context.fillRect(
                                i * viewGlobals.scale,
                                j * viewGlobals.scale,
                                viewGlobals.scale,
                                viewGlobals.scale);
                            context.restore();
                        }
                    }
                }
            }
        }
    };
});
