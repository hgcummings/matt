define(['views/globals'], function(viewGlobals) {
    return {
        draw: function(context, model) {
            context.fillStyle = '#000000';
            context.fillRect(0, 0, model.width * viewGlobals.scale, model.height * viewGlobals.scale);
            
            context.strokeStyle = '#ccc';
            context.lineWidth = viewGlobals.scale / 8;
            
            for (var i = 0; i < model.pillars.length; ++i) {
                var pillar = model.pillars[i];
                context.beginPath();
                for (var j = 0; j < pillar.walls.length; ++j) {
                    context.moveTo(
                        viewGlobals.scale * pillar.x,
                        viewGlobals.scale * pillar.y);
                    var angle = pillar.walls[j] * Math.PI / 2;
                    context.lineTo(
                        viewGlobals.scale * (pillar.x + Math.sin(angle)),
                        viewGlobals.scale * (pillar.y - Math.cos(angle)));
                }
                context.stroke();
                context.closePath();
                
                context.strokeStyle = '#eee';
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
    }
});