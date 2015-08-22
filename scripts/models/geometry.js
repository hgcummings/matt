define(function() {
    return {
        /* Determines whether a path crosses a wall, and returns the direction if it does.
           Assumes that they are both of length 1 and aligned with the grid axes.
         */
        crosses: function(path, wall) {
            for (var orientation = 0; orientation < 2; ++orientation) {
                if (wall[0][orientation] === wall[1][orientation] &&
                    path[0][1 - orientation] < Math.max(wall[0][1 - orientation], wall[1][1 - orientation]) &&
                    path[0][1 - orientation] > Math.min(wall[0][1 - orientation], wall[1][1 - orientation]) &&
                    wall[0][orientation] < Math.max(path[0][orientation], path[1][orientation]) &&
                    wall[0][orientation] > Math.min(path[0][orientation], path[1][orientation])) {
                        return ((2 * orientation) - 1)
                         * (wall[1][1 - orientation] - wall[0][1- orientation])
                         * (path[1][orientation] - path[0][orientation]);
                    }
                }
            }
        }
})