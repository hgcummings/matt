define(function() {
    var enabled = true;
    
    var stepSound = new Audio('audio/step.wav');
    var wallSound = new Audio('audio/wall.wav');
    
    var wrap = function(sound) {
        return function() {
            if (enabled) {
                sound.play();
            }
        }
    }
    
    return {
        toggle: function() {
            enabled = !enabled;
        },
        wall: wrap(wallSound),
        step: wrap(stepSound)
    }
})