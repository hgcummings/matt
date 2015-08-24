require.config({
    paths: {
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min'
    }
});

require(['game', 'audio', 'models/difficulty'], function(game, audio, difficulty) {
    'use strict';
    
    var startButtons = document.getElementsByClassName('btn-start');
    for (var i = 0; i < startButtons.length; ++i) {
        var button = startButtons[i];
        button.onclick = function() {
            game.init(difficulty[this.innerText.toUpperCase()])
        }
    }
    
    var audioButton = document.getElementById('volume');
    audioButton.onclick = function() {
        audioButton.classList.toggle('glyphicon-volume-off');
        audioButton.classList.toggle('glyphicon-volume-up');
        audio.toggle();
    }
    
    game.init(difficulty.TRICKSY);
});