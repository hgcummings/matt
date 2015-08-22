define(['models/grid', 'models/minotaur', 'models/theseus', 'models/environment',
    'views/grid', 'views/minotaur', 'views/theseus', 'views/environment', 'views/globals'],
    function(gridModel, minotaurModel, theseusModel, environmentModel, 
        gridView, minotaurView, theseusView, environmentView, viewGlobals) {
        return {
            init: function() {
                var environment = environmentModel.init();
                var grid = gridModel.init(environment);
                var minotaur = minotaurModel.init(grid, environment);
                var theseus = theseusModel.init(grid, environment);

                var container = document.getElementById('game');
                var canvas = document.createElement('canvas');
                canvas.width = viewGlobals.scale * grid.width;
                canvas.height = viewGlobals.scale * grid.height;
                var context = canvas.getContext('2d');
                container.appendChild(canvas);
                
                var gameTime = new Date().getTime();
                var animate = function() {
                    var newTime = new Date().getTime();
                    var dt = newTime - gameTime;
                    gameTime = newTime;
                    grid.update(dt);
                    minotaur.update(dt);
                    theseus.update(dt);
                    environment.update(dt);

                    gridView.draw(context, grid);                    
                    environmentView.draw(context, environment);
                    minotaurView.draw(context, minotaur);
                    theseusView.draw(context, theseus);
                    
                    window.requestAnimationFrame(animate);
                };
                
                window.requestAnimationFrame(animate);
            }
        }
});