define(['views/globals'], function(viewGlobals) {
    'use strict';
    return {
        draw: function(context, model) {
            var drawPaths = function(paths, colour) {
                for (var j = 0; j < paths.length; ++j) {
                    var path = paths[j];
                    context.strokeStyle = colour;
                    context.beginPath();
                    context.moveTo(path[0][0] * viewGlobals.scale, path[0][1] * viewGlobals.scale);
                    context.lineTo(path[1][0] * viewGlobals.scale, path[1][1] * viewGlobals.scale);
                    context.stroke();
                    context.closePath();
                }
            };
                
            for (var i = 0; i < model.lightSources.length; ++i) {
                for (var j = 0; j < model.lightSources[i].lightCells.length; ++j) {
                    var cell = model.lightSources[i].lightCells[j];
                    context.save();
                    context.globalAlpha = cell.lum;
                    context.fillStyle = '#ffc';
                    context.fillRect(
                        (cell.x - 0.5) * viewGlobals.scale,
                        (cell.y - 0.5) * viewGlobals.scale,
                        viewGlobals.scale,
                        viewGlobals.scale);
                    context.restore();
                }
                
                if (window.DEBUG_ENABLED) {
                    drawPaths(model.lightSources[i].blockedPaths, '#f00');
                    drawPaths(model.lightSources[i].clearPaths, '#0f0');
                }
            }
            
            model.soundSources.forEach(function(source) {
                if (source.r < 0.5) {
                    return;
                }
                
                context.save();
                context.globalAlpha = 1 - (source.r / source.v);
                context.lineWidth = viewGlobals.scale / 8;
                context.strokeStyle = '#fff';
                context.beginPath();
                context.arc(
                    viewGlobals.scale * source.x,
                    viewGlobals.scale * source.y,
                    viewGlobals.scale * source.r,
                    0, Math.PI * 2, false);
                context.stroke();
                context.closePath();
                context.restore();
            });
        }
    };
});
