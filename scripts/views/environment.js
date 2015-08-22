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
        }
    };
})