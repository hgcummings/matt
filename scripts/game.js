define(['models/grid', 'models/minotaur', 'models/theseus', 'models/environment',
    'views/grid', 'views/minotaur', 'views/theseus', 'views/environment', 'views/globals', 'views/hud', 'views/hint'],
    function(gridModel, minotaurModel, theseusModel, environmentModel,
        gridView, minotaurView, theseusView, environmentView, viewGlobals, hudView, hintView) {
        'use strict';
        return {
            init: function(difficulty) {
                document.getElementById('menu').style.display = 'none';
                var environment = environmentModel.init(difficulty);
                var grid = gridModel.init(difficulty, environment);
                var minotaur = minotaurModel.init(difficulty, grid, environment);
                var theseus = theseusModel.init(difficulty, grid, environment);
                
                var hud = hudView.init(grid, theseus);
                var container = document.getElementById('game');
                var canvas = document.createElement('canvas');
                canvas.width = (viewGlobals.scale * grid.width) + hud.image.width;
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
                };
                
                hintView.setText('Theseus is coming for you. Better run! Use arrow keys or W,A,S,D to move...', 'warning');
                var animate = function() {
                    var newTime = new Date().getTime();
                    var dt = newTime - gameTime;
                    gameTime = newTime;
                    grid.update(dt);
                    minotaur.update(dt);
                    theseus.update(dt);
                    environment.update(dt);

                    var illuminated = false;
                    for (var i = 0; i < environment.lightSources.length; ++i) {
                        var lightSource = environment.lightSources[i];
                        if (lightSource.illuminatesPosition(minotaur.x, minotaur.y)) {
                            illuminated = true;
                            break;
                        }
                    }
                    
                    if (Math.abs(theseus.x - minotaur.x) + Math.abs(theseus.y - minotaur.y) < 0.25) {
                        if (illuminated) {
                            endGame('danger', 'Theseus hunted you down and defeated you.');
                        } else {
                            endGame('success', 'The hunter becomes the hunted. You defeated Theseus!');
                        }
                    } else if (theseus.light <= 0) {
                        if (illuminated) {
                            hintView.setText('Be careful! If you stand in the light Theseus can still attack you.', 'danger');
                        } else {
                            hintView.setText('Theseus is defenseless in the dark. Can you prevent him from escaping?', 'info');
                        }

                        if (theseus.x === environment.lightSources[0].x &&
                          theseus.y - 0.5 === environment.lightSources[0].y) {
                            endGame('warning', 'You evaded Theseus, but he escaped to fight another day.');
                        }
                    }
                    
                    if (gameInProgress) {
                        gridView.draw(context, grid);
                        environmentView.draw(context, environment);
                        minotaurView.draw(context, minotaur);
                        theseusView.draw(context, theseus);
                        
                        hud.update();
                        context.drawImage(hud.image, viewGlobals.scale * grid.width, 0);
    
                        window.requestAnimationFrame(animate);
                    }
                };

                window.requestAnimationFrame(animate);
            }
        };
    }
);