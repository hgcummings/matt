require.config({
    paths: {
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min'
    }
});

require(['game', 'audio', 'models/difficulty'], function(game, audio, difficulty) {
    'use strict';
    
    var beginButton = document.getElementById('begin');
    beginButton.onclick = function() {
        document.getElementById('intro').remove();
        game.init(difficulty.TRICKSY);
    };
    
    var startButtons = document.getElementsByClassName('btn-start');
    var startGame = function() {
        game.init(difficulty[this.textContent.toUpperCase()]);
    };
    for (var i = 0; i < startButtons.length; ++i) {
        var button = startButtons[i];
        button.onclick = startGame;
    }
    
    var audioButton = document.getElementById('volume');
    audioButton.onclick = function() {
        audioButton.classList.toggle('glyphicon-volume-off');
        audioButton.classList.toggle('glyphicon-volume-up');
        audio.toggle();
    };
    
});