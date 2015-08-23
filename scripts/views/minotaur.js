define(['views/globals'], function(viewGlobals) {
    return {
        draw: function(context, model) {
            context.fillStyle = '#a52a2a';
            
            context.beginPath();
            context.arc(
                viewGlobals.scale * model.x,
                viewGlobals.scale * model.y,
                viewGlobals.scale / 3,
                0, Math.PI * 2, false);
            context.fill();
            context.closePath();
        }
    }
});