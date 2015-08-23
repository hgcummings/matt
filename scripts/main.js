require.config({
    paths: {
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min'
    }
});

require(['game', 'models/difficulty'], function(game, difficulty) {
    'use strict';
    
    var startButtons = document.getElementsByClassName('btn-start');
    for (var i = 0; i < startButtons.length; ++i) {
        var button = startButtons[i];
        button.onclick = function() {
            game.init(difficulty[this.innerText.toUpperCase()])
        }
    }
    
    game.init(difficulty.TRICKSY);
});