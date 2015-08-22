define(['views/globals'], function(viewGlobals) {
    return {
        draw: function(context, model) {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, model.width * viewGlobals.scale, model.height * viewGlobals.scale);
            
            context.strokeStyle = '#ccc';
            context.lineWidth = viewGlobals.scale / 8;
            
            var pillars = [];
            
            context.beginPath();
            for (var i = 0; i < model.width; ++i) {
                for (var j = 0; j < model.height; ++j) {
                    if (model.verticals[i][j]) {
                        context.moveTo(i * viewGlobals.scale, j * viewGlobals.scale);
                        context.lineTo(i * viewGlobals.scale, (j + 1) * viewGlobals.scale);
                        pillars.push([i, j + model.verticals[i][j] - 1]);
                    }
                    if (model.horizontals[i][j]) {
                        context.moveTo(i * viewGlobals.scale, j * viewGlobals.scale);
                        context.lineTo((i + 1) * viewGlobals.scale, j * viewGlobals.scale);
                        pillars.push([i + model.horizontals[i][j] - 1, j]);
                    }
                }
            }
            context.stroke();
            context.closePath();
            
            context.strokeStyle = '#eee';
            for (var k = 0; k < pillars.length; ++k) {
                context.beginPath();
                context.arc(
                    viewGlobals.scale * pillars[k][0],
                    viewGlobals.scale * pillars[k][1],
                    viewGlobals.scale / 16,
                    0, Math.PI * 2, false);
                context.stroke();
            }
            context.closePath();
        }
    }
});