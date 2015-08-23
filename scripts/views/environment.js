define(['views/globals'], function(viewGlobals) {
    return {
        draw: function(context, model) {
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
            }
            
            for (var i = 0; i < model.soundSources.length; ++i) {
                var source = model.soundSources[i];
                context.save();
                context.globalAlpha = 1 - (source.r / source.v);
                context.lineWidth = viewGlobals.scale / 8;
                context.strokeStyle = '#fff'
                context.beginPath();
                context.arc(
                    viewGlobals.scale * source.x,
                    viewGlobals.scale * source.y,
                    viewGlobals.scale * source.r,
                    0, Math.PI * 2, false);
                context.stroke();
                context.closePath();
                context.restore();
            }
        }
    };
})