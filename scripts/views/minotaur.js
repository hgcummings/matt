define(['views/globals'], function(viewGlobals) {
    'use strict';
    
    var u = viewGlobals.scale;
    
    var sprite = document.createElement('canvas');
    sprite.width = u;
    sprite.height = u;
    var ctx = sprite.getContext('2d');
    ctx.fillStyle = '#a52a2a';

    ctx.beginPath();
    ctx.moveTo(u / 2, u / 16);
    ctx.quadraticCurveTo(// A
        3 * u / 16, u / 16,
        21 * u / 32, u / 8
    );
    ctx.quadraticCurveTo(// B
        5 * u / 8, u / 2,
        3 * u / 4, u / 2
    );
    ctx.quadraticCurveTo(// C
        u, 3 * u / 4,
        3 * u / 4, 15 * u / 16
    );
    ctx.quadraticCurveTo(// D
        u / 2, u,
        u / 4, 15 * u / 16
    );
    ctx.quadraticCurveTo(// E
        0, 3 * u / 4,
        u / 4, u / 2
    );
    ctx.quadraticCurveTo(// F
        3 * u / 8, u / 2,
        11 * u / 32, u / 8
    );
    ctx.quadraticCurveTo(// G
        13 * u / 16, u / 16,
        u / 2, u / 16
    );
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(3 * u / 4, 5 * u / 8);
    ctx.quadraticCurveTo(7 * u / 8, 3 * u / 8, 3 * u / 4, 1 * u / 8);
    ctx.quadraticCurveTo(u, 3 * u / 4, 3 * u / 4, 7 * u / 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(u / 4, 5 * u / 8);
    ctx.quadraticCurveTo(u / 8, 3 * u / 8, u / 4, 1 * u / 8);
    ctx.quadraticCurveTo(0, 3 * u / 4, u / 4, 7 * u / 8);
    ctx.fill();
    ctx.closePath();
    
    return {
        draw: function(context, model) {
            context.save();
            context.translate(model.x * u, model.y * u);
            context.rotate(model.d * Math.PI / 2);
            context.drawImage(sprite, -0.5 * u, -0.5 * u);
            context.restore();
        }
    };
});