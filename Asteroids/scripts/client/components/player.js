//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Player = function() {
    'use strict';
    let that = {};
    let position = {
        x: 0,
        y: 0
    };
    let localPosition = {
        x: .5, 
        y: .5,
    }
    let window = {
        x: 0,
        y: 0
    }

    let size = {
        width: 0.05,
        height: 0.05
    };
    let direction = 0;
    let rotateRate = 0;
    let speed = 0;
    let username = 'P1';

    const WORLD_WIDTH = 3840;
    const WORLD_HEIGHT = 2304;
    const WINDOW_WIDTH = 600;
    const WINDOW_HEIGHT = 600;
    const TILE_WIDTH = 15;
    const TILE_HEIGHT = 9;
    const SINGLE_TILE_WIDTH = 1 / TILE_WIDTH;
    const SINGLE_TILE_HEIGHT = 1 / TILE_HEIGHT;

    Object.defineProperty(that, 'direction', {
        get: () => direction,
        set: (value) => { direction = value }
    });

    Object.defineProperty(that, 'speed', {
        get: () => speed,
        set: value => { speed = value; }
    });

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate,
        set: value => { rotateRate = value; }
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'window', {
        get: () => window
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'localPosition', {
        get: () => localPosition
    });

    //------------------------------------------------------------------
    //
    // Public function that moves the player in the current direction.
    //
    //------------------------------------------------------------------
    that.move = function(elapsedTime) {
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);
        if (position.x + (vectorX * elapsedTime * speed) <= 1-(.2*SINGLE_TILE_WIDTH) && position.x + (vectorX * elapsedTime * speed) >=(.2*SINGLE_TILE_WIDTH)){
            position.x += (vectorX * elapsedTime * speed);
        }
        if (position.y + (vectorY * elapsedTime * speed) <= 1-(.2*SINGLE_TILE_HEIGHT) && position.y + (vectorY * elapsedTime * speed) >=(.2*SINGLE_TILE_HEIGHT)){
            position.y += (vectorY * elapsedTime * speed);
        }

        const TILE_WIDTH = 15;
        const TILE_HEIGHT = 9;
        
        if (position.x + (vectorX * elapsedTime * speed) <= 1-(.2*SINGLE_TILE_WIDTH) && position.x + (vectorX * elapsedTime * speed) >=(.2*SINGLE_TILE_WIDTH)){
            if (localPosition.x + (vectorX * elapsedTime * speed) * TILE_WIDTH  < .2 || localPosition.x + (vectorX * elapsedTime * speed) * TILE_WIDTH > .8){
                window.x += (vectorX * elapsedTime * speed);
            }else{
                localPosition.x += (vectorX * elapsedTime * speed) * TILE_WIDTH;
            }
        }
        if (position.y + (vectorY * elapsedTime * speed) <= 1-(.2*SINGLE_TILE_HEIGHT) && position.y + (vectorY * elapsedTime * speed) >=(.2*SINGLE_TILE_HEIGHT)){ 
            if (localPosition.y + (vectorY * elapsedTime * speed) * TILE_HEIGHT  < .2 || localPosition.y + (vectorY * elapsedTime * speed) * TILE_HEIGHT > .8){
                window.y += (vectorY * elapsedTime * speed);
            }else{
                localPosition.y += (vectorY * elapsedTime * speed) * TILE_HEIGHT;
            }
        }

    
    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player right.
    //
    //------------------------------------------------------------------
    that.rotateRight = function(elapsedTime) {
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player left.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        direction -= (rotateRate * elapsedTime);
    };

    that.update = function(elapsedTime) {
    };

    return that;
};
