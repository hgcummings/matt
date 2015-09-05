define(['models/grid', 'models/minotaur', 'models/theseus', 'models/environment',
    'views/grid', 'views/minotaur', 'views/theseus', 'views/environment', 'views/globals', 'views/hint'],
    function(gridModel, minotaurModel, theseusModel, environmentModel,
        gridView, minotaurView, theseusView, environmentView, viewGlobals, hintView) {
        'use strict';
        return {
            init: function(difficulty) {
                document.getElementById('menu').style.display = 'none';
                var environment = environmentModel.init(difficulty);
                var grid = gridModel.init(difficulty, environment);
                var minotaur = minotaurModel.init(difficulty, grid, environment);
                var theseus = theseusModel.init(difficulty, grid, environment);

                var container = document.getElementById('game');
                var canvas = document.createElement('canvas');
                canvas.width = viewGlobals.scale * grid.width;
                canvas.height = viewGlobals.scale * grid.height;
                var context = canvas.getContext('2d');
                container.appendChild(canvas);

                var gameTime = new Date().getTime();
                var gameInProgress = true;
                
                var endGame = function(resultClass, resultText) {
                    hintView.clear();
                    container.removeChild(canvas);
                    document.getElementById('menu').style.display = 'block';
                    
                    var gameOver = document.getElementById('gameOver');
                    gameOver.className = 'alert';
                    var result = document.getElementById('result');
                    gameOver.classList.add(resultClass);
                    result.textContent = resultText;
                    gameInProgress = false;
                }
                
                hintView.setText('Theseus is coming for you. Better run! Use arrow keys or W,A,S,D to move...', 'warning');
                var animate = function() {
                    var newTime = new Date().getTime();
                    var dt = newTime - gameTime;
                    gameTime = newTime;
                    grid.update(dt);
                    minotaur.update(dt);
                    theseus.update(dt);
                    environment.update(dt);
                    
                    if (Math.abs(theseus.x - minotaur.x) + Math.abs(theseus.y - minotaur.y) < 0.25) {
                        if (theseus.light > 0) {
                            endGame('alert-danger', 'Theseus hunted you down and defeated you.');
                        } else {
                            endGame('alert-success', 'The hunter becomes the hunted. You defeated Theseus!');
                        }
                    } else if (theseus.light <= 0) {
                        hintView.setText('Theseus is defenseless in the dark. Can you prevent him from escaping?', 'info');
                        if (theseus.x === environment.lightSources[0].x &&
                          theseus.y - 0.5 === environment.lightSources[0].y) {
                            endGame('alert-warning', 'You evaded Theseus, but he escaped to fight another day.')
                        }
                    }
                    
                    if (gameInProgress) {
                        gridView.draw(context, grid);
                        environmentView.draw(context, environment);
                        minotaurView.draw(context, minotaur);
                        theseusView.draw(context, theseus);
    
                        window.requestAnimationFrame(animate);
                    }
                };

                window.requestAnimationFrame(animate);
            }
        };
    }
);