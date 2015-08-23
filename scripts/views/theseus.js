define(['views/globals'], function(viewGlobals) {
    return {
        draw: function(context, model) {
            context.fillStyle = '#ffd700';
            
            context.beginPath();
            context.arc(
                viewGlobals.scale * model.x,
                viewGlobals.scale * model.y,
                viewGlobals.scale / 4,
                0, Math.PI * 2, false);
            context.fill();
            context.closePath();
        }
    }
});