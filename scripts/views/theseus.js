define(['views/globals'], function(viewGlobals) {
    'use strict';
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
            
            if (model.lastAlert && model.lastAlert > new Date().getTime() - 500) {
                context.fillStyle = '#fff';
                context.textAlign = 'center';
                context.font = 'bold ' + viewGlobals.scale + 'px sans-serif';
                context.fillText('!',
                     viewGlobals.scale * model.x,
                     viewGlobals.scale * model.y - viewGlobals.scale * 3 / 4);
            }
        }
    };
});