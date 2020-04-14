// ------------------------------------------------------------------
//
// Nodejs module that represents the model for an asteroid.
//
// ------------------------------------------------------------------
'use strict';

let random = require('./random');
let UUID = require('../../node_modules/uuid-js/lib/uuid');


//------------------------------------------------------------------
//
// Public function used to initially create a new asteroid.
//
//------------------------------------------------------------------
function createAsteroid(spec) {
    let that = {};
    let position = null;
    let radius = null;

    if (spec === null || spec === undefined){
        position = {x: random.nextDouble(), y: random.nextDouble()};
        radius = random.nextRange(1,3); // small, medium or large asteroid
    }else{
        position = {x: spec.x, y: spec.y};
        if (spec.radius !== 1) {
            radius = spec.radius - 1;
        } 
    }
    let speed = random.nextDouble() % 0.00002;  // unit distance per millisecond
    let direction = random.nextCircleVector(1); // randomly assigns a direction for the asteroid to travel
    let id = UUID.create().toString();


    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'radius', {
        get: () => radius
    });

    Object.defineProperty(that, 'id', {
        get: () => id
    });

    Object.defineProperty(that, 'direction', {
        get: () => direction
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed
    });


    //------------------------------------------------------------------
    //
    // Function used to update the asteroid during the game loop.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {

        position.x += (direction.x * elapsedTime * speed);
        position.y += (direction.y * elapsedTime * speed);

        if (position.x > 1){
            position.x -= 1;
        }
        if (position.x < 0){
            position.x += 1;
        }
        if (position.y > 1){
            position.y -= 1;
        }
        if (position.y < 0){
            position.y += 1;
        }

    };

    return that;
}

module.exports.create = (spec) => createAsteroid(spec);
