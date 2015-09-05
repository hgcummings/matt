define(['views/globals'], function(viewGlobals) {
    'use strict';
    return {
        draw: function(context, model) {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, model.width * viewGlobals.scale, model.height * viewGlobals.scale);
            
            context.lineWidth = viewGlobals.scale / 8;
            
            for (var i = 0; i < model.pillars.length; ++i) {
                var pillar = model.pillars[i];
                context.strokeStyle = '#ccc';
                context.beginPath();
                for (var j = 0; j < pillar.walls.length; ++j) {
                    context.moveTo(
                        viewGlobals.scale * pillar.x,
                        viewGlobals.scale * pillar.y);
                    context.lineTo(
                        viewGlobals.scale * pillar.walls[j][0],
                        viewGlobals.scale * pillar.walls[j][1]);
                }
                context.stroke();
                context.closePath();
                
                context.strokeStyle = '#fff';
                context.beginPath();
                context.arc(
                    viewGlobals.scale * pillar.x,
                    viewGlobals.scale * pillar.y,
                    viewGlobals.scale / 16,
                    0, Math.PI * 2, false);
                context.stroke();
                context.closePath();
            }
        }
    };
});