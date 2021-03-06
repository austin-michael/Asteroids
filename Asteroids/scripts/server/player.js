// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a player.
//
// ------------------------------------------------------------------
'use strict';

let random = require('./random');

//------------------------------------------------------------------
//
// Public function used to initially create a newly connected player
// at some random location.
//
//------------------------------------------------------------------
function createPlayer(name) {

    let that = {};

    let position = {
        x: 0.5,
        y: 0.5
    };

    let size = {
        width: 0.05,
        height: 0.05,
        radius: 0.0005
    };
    let direction = random.nextDouble() * 2 * Math.PI;    // Angle in radians
    let rotateRate = Math.PI / 1000;    // radians per millisecond
    let speed = 0.00002;                  // unit distance per millisecond
    let reportUpdate = false;    // Indicates if this model was updated during the last update
    let playerName = name;
    let beenHit = false;
    let hitTimer = 0;
    let score = 0;

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });

    Object.defineProperty(that, 'position', {
        get: () => position,
        set: pos => position = pos
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    })

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate
    });

    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });

    Object.defineProperty(that, 'radius', {
        get: () => size.radius
    });

    Object.defineProperty(that, 'username', {
        get: () => playerName
    });

    Object.defineProperty(that, 'beenHit', {
        get: () => beenHit,
        set: value => beenHit = value
    });

    Object.defineProperty(that, 'hitTimer', {
        get: () => hitTimer,
        set: value => hitTimer = value
    });
    
    Object.defineProperty(that, 'score', {
        get: () => score,
        set: value => score = value
    });
    //------------------------------------------------------------------
    //
    // Moves the player forward based on how long it has been since the
    // last move took place.
    //
    //------------------------------------------------------------------
    that.move = function (elapsedTime) {
        if (!beenHit) {
            reportUpdate = true;
            let vectorX = Math.cos(direction);
            let vectorY = Math.sin(direction);

            if (position.x + (vectorX * elapsedTime * speed) <= 1 && position.x + (vectorX * elapsedTime * speed) >= 0) {
                position.x += (vectorX * elapsedTime * speed);
            }
            if (position.y + (vectorY * elapsedTime * speed) <= 1 && position.y + (vectorY * elapsedTime * speed) >= 0) {
                position.y += (vectorY * elapsedTime * speed);
            }

        }
    };

    //------------------------------------------------------------------
    //
    // Rotates the player right based on how long it has been since the
    // last rotate took place.
    //
    //------------------------------------------------------------------
    that.rotateRight = function (elapsedTime) {
        if (!beenHit){
            reportUpdate = true;
            direction += (rotateRate * elapsedTime);
        }
    };

    //------------------------------------------------------------------
    //
    // Rotates the player left based on how long it has been since the
    // last rotate took place.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function (elapsedTime) {
        if (!beenHit) {
            reportUpdate = true;
            direction -= (rotateRate * elapsedTime);
        }
    };

    //------------------------------------------------------------------
    //
    // Function used to update the player during the game loop.
    //
    //------------------------------------------------------------------
    that.update = function (elapsedTime) {
        if (beenHit){
            hitTimer -= elapsedTime
            if (hitTimer <= 0){
                beenHit = false;
            }
        }
    };

    return that;
}

module.exports.create = (name) => createPlayer(name);
