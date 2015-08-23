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
                        var start = [i + 0.5, j + 0.5]
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
            
            if (window.DEBUG_FOUND_PATH) {
                for (var i = 0; i < window.DEBUG_FOUND_PATH.length - 1; ++i) {
                    var start = window.DEBUG_FOUND_PATH[i];
                    var end = window.DEBUG_FOUND_PATH[i + 1];
                    context.globalAlpha = 0.5;
                    context.strokeStyle = '#fff'
                    context.beginPath();
                    context.moveTo((start[0] + 0.5) * viewGlobals.scale, (start[1] + 0.5) * viewGlobals.scale);
                    context.lineTo((end[0] + 0.5) * viewGlobals.scale, (end[0] + 0.5) * viewGlobals.scale);
                    context.stroke();
                    context.closePath();
                    context.restore();
                }
            }
        }
    };
});
