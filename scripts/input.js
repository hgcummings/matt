define(function() {
    var activeKey;
    
    var keyMap = {
        87: 0,
        38: 0,
        68: 1,
        39: 1,
        83: 2,
        40: 2,
        65: 3,
        37: 3
    };
    
    function directionFromKey(keyCode) {
        if (keyCode && keyMap.hasOwnProperty(keyCode.toString())) {
            return keyMap[keyCode];
        } else {
            return null;
        }
    }
    
    var onKeyDown = function (event) {
        if (directionFromKey(event.keyCode) !== null) {
            activeKey = event.keyCode;
            event.preventDefault();
        }
    };
    
    var onKeyUp = function (event) {
        if (event.keyCode === activeKey) {
            activeKey = null;
        }
    };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    return {
        getDirection: function() {
            return directionFromKey(activeKey);
        }
    }
})