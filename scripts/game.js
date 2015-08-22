define(['models/grid', 'models/minotaur', 'models/theseus',
    'views/grid', 'views/minotaur', 'views/theseus', 'views/globals'],
    function(gridModel, minotaurModel, theseusModel, gridView, minotaurView, theseusView, viewGlobals) {
        return {
            init: function() {
                var container = document.getElementById('game');
                var canvas = document.createElement('canvas');
                
                var grid = gridModel.init();
                canvas.width = viewGlobals.scale * grid.width;
                canvas.height = viewGlobals.scale * grid.height;
                
                var context = canvas.getContext('2d');
    
                container.appendChild(canvas);
                
                var minotaur = minotaurModel.init(grid);
                var theseus = theseusModel.init(grid);
                
                var gameTime = new Date().getTime();
                var animate = function() {
                    var newTime = new Date().getTime();
                    var dt = newTime - gameTime;
                    gameTime = newTime;
                    grid.update(dt);
                    minotaur.update(dt);
                    theseus.update(dt);
                    
                    gridView.draw(context, grid);
                    minotaurView.draw(context, minotaur);
                    theseusView.draw(context, theseus);
                    
                    window.requestAnimationFrame(animate);
                };
                
                window.requestAnimationFrame(animate);
            }
        }
});