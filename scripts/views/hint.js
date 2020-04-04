define(function() {
    'use strict';

    var element = document.getElementById('hint');
    
    return {
        clear: function() {
            element.className = '';
            element.textContent = '';
        },
        setText: function(text, level) {
            element.className = 'alert';
            element.classList.add(level);
            element.textContent = text;
        }
    };
});