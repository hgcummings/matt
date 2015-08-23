define(function() {
    var element = document.getElementById('hint');
    
    return {
        setText: function(text) {
            element.innerText = text;
        }
    }
});