define(['views/globals'], function(viewGlobals) {
    'use strict';
    var canvas, context, totalTime, unit = viewGlobals.scale, frame = 100, lastUpdate, flameTip, flameColour;
    return {
        init: function(grid, theseus) {
            canvas = document.createElement('canvas');
            canvas.width = unit * 2;
            canvas.height = unit * grid.height;
            totalTime = theseus.light;
            context = canvas.getContext('2d');
            
            var bottom = canvas.height - unit;
            var left = canvas.width / 4;
            var right = canvas.width * 3 / 4;
            
            return {
                image: canvas,
                update: function() {
                    var height = (2 / 3) * canvas.height * theseus.light / totalTime;
                    
                    var top = bottom - height;
                    
                    context.fillStyle = '#222222';
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    
                    if (theseus.light > 0) {
                        if (!lastUpdate || new Date().getTime() - lastUpdate > frame) {
                            lastUpdate = new Date().getTime();
                            flameTip = left + Math.round(Math.random() * (right - left));
                            flameColour = 'rgb(255, ' + (128 + Math.round(Math.random() * 127)) + ', 0)';
                        }
                        
                        context.beginPath();
                        context.fillStyle = flameColour;
                        context.moveTo(flameTip, top - unit);
                        context.bezierCurveTo(
                            (right + left) / 2, top - (unit),
                            right + (right - left) / 4, top,
                            (right + left) / 2, top);
                        context.bezierCurveTo(
                            left - (right - left) / 4, top,
                            (right + left) / 2, top - (unit),
                            flameTip, top - unit);
                        context.fill();
                        
                        context.beginPath();
                        context.fillStyle = '#ffffff';
                        context.moveTo(left, top);
                        context.quadraticCurveTo((right + left) / 2, top + unit / 8, right, top);
                        context.lineTo(right, bottom);
                        context.quadraticCurveTo((right + left) / 2, bottom + unit / 4, left, bottom);
                        context.lineTo(left, top);
                        context.fill();
                    }
                    
                }
            };  
        }
        
    };
});