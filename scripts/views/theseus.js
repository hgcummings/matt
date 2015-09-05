define(['views/globals'], function(viewGlobals) {
    'use strict';
    
    var u = viewGlobals.scale;
    
    var sprite = document.createElement('canvas');
    sprite.width = u;
    sprite.height = u;
    var ctx = sprite.getContext('2d');

    ctx.fillStyle = '#CD8500';
    ctx.beginPath();
    ctx.arc(u / 4, u / 2, u / 8, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(u * 3 / 4, u / 2, u / 8, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(u / 2, u / 2, u / 4, 0, Math.PI * 2, false);
    ctx.fill();
    
    return {
        draw: function(context, model) {
            context.save();
            context.translate(model.x * u, model.y * u);
            context.rotate(model.d * Math.PI / 2);
            context.drawImage(sprite, -0.5 * u, -0.5 * u);
            context.restore();
            
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