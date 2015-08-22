require.config({
    paths: {
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min'
    }
});

require(['game'], function(game) {
    game.init();
});