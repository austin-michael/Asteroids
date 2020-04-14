//------------------------------------------------------------------
//
// Model for each missile in the game.
//
//------------------------------------------------------------------
MyGame.components.Asteroid = function(spec) {
    'use strict';
    let that = {};

    Object.defineProperty(that, 'position', {
        get: () => spec.position
    });

    Object.defineProperty(that, 'radius', {
        get: () => spec.radius
    });

    Object.defineProperty(that, 'speed', {
        get: () => spec.speed
    });

    Object.defineProperty(that, 'id', {
        get: () => spec.id
    });
    
    Object.defineProperty(that, 'direction', {
        get: () => spec.direction
    });

    //------------------------------------------------------------------
    //
    // Update the position of the missle.  We don't receive updates from
    // the server, because the missile moves in a straight line until it
    // explodes.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        spec.position.x += (spec.direction.x * elapsedTime * spec.speed);
        spec.position.y += (spec.direction.y * elapsedTime * spec.speed);

        if (spec.position.x > 1){
            spec.position.x -= 1;
        }
        if (spec.position.x < 0){
            spec.position.x += 1;
        }
        if (spec.position.y > 1){
            spec.position.y -= 1;
        }
        if (spec.position.y < 0){
            spec.position.y += 1;
        }
    };

    return that;
};