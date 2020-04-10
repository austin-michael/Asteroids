// ------------------------------------------------------------------
//
// Rendering function for a Player object.
//
// ------------------------------------------------------------------
MyGame.renderer.Player = (function (graphics) {
    'use strict';
    let that = {};

    const WORLD_WIDTH = 3840;
    const WORLD_HEIGHT = 2304;
    const WINDOW_WIDTH = 600;
    const WINDOW_HEIGHT = 600;
    const TILE_WIDTH = 15;
    const TILE_HEIGHT = 9;
    const SINGLE_TILE_WIDTH = 1 / TILE_WIDTH;
    const SINGLE_TILE_HEIGHT = 1 / TILE_HEIGHT;

    // ------------------------------------------------------------------
    //
    // Renders a Player model.
    //
    // ------------------------------------------------------------------
    that.render = function (model, texture) {
        // draw the background
        const WORLD_POSITION_X = TILE_WIDTH * model.window.x; // somewhere between (0, 15)
        const WORLD_POSITION_Y = TILE_HEIGHT * model.window.y; // somewhere between (0, 9)
        const DELTA_X = (WORLD_POSITION_X - Math.floor(WORLD_POSITION_X)); // distance from ship to left of tile
        const DELTA_Y = (WORLD_POSITION_Y - Math.floor(WORLD_POSITION_Y)); // distance from ship to top of tile

        const CENTER_IMG_NUMBER = Math.floor(WORLD_POSITION_X) + (15 * Math.floor(WORLD_POSITION_Y));

        // TOP ROW
        for (let i = CENTER_IMG_NUMBER - TILE_WIDTH - 1; i < CENTER_IMG_NUMBER - 12 - 1; i++) {
            if (i >= 0 && i < (TILE_WIDTH * TILE_HEIGHT)) {
                let img = MyGame.assets[`tile_${i}`];
                let center = {};
                if (i == CENTER_IMG_NUMBER - TILE_WIDTH - 1 && (i + 1) % TILE_WIDTH != 0) {
                    center.x = -DELTA_X;
                    center.y = -DELTA_Y;
                } else if (CENTER_IMG_NUMBER - i == 15) {
                    center.x = 1 - DELTA_X;
                    center.y = -DELTA_Y;
                } else {
                    if (i % TILE_WIDTH != 0) {
                        center.x = 2 - DELTA_X;
                        center.y = -DELTA_Y;
                    }
                }
                graphics.drawImage(
                    img,
                    { x: center.x, y: center.y },
                    { width: 1, height: 1 }
                );
            }
        }

        // CENTER ROW
        for (let i = CENTER_IMG_NUMBER - 1; i <= CENTER_IMG_NUMBER + 1; i++) {
            if (i >= 0 && i < (TILE_WIDTH * TILE_HEIGHT)) {
                let img = MyGame.assets[`tile_${i}`];
                let center = {};
                if (i == CENTER_IMG_NUMBER - 1 && (i + 1) % TILE_WIDTH != 0) {
                    center.x = -DELTA_X;
                    center.y = 1 - DELTA_Y;
                } else if (i == CENTER_IMG_NUMBER) {
                    center.x = 1 - DELTA_X;
                    center.y = 1 - DELTA_Y;
                } else {
                    if (i % TILE_WIDTH != 0) {
                        center.x = 2 - DELTA_X;
                        center.y = 1 - DELTA_Y;
                    }
                }
                graphics.drawImage(
                    img,
                    { x: center.x, y: center.y },
                    { width: 1, height: 1 }
                );
            }
        }

        // BOTTOM ROW
        for (let i = CENTER_IMG_NUMBER + 15 - 1; i <= CENTER_IMG_NUMBER + 15 + 1; i++) {
            if (i >= 0 && i < (TILE_HEIGHT * TILE_WIDTH)) {
                let img = MyGame.assets[`tile_${i}`];
                let center = {};
                if (i == CENTER_IMG_NUMBER + TILE_WIDTH - 1 && (i + 1) % TILE_WIDTH != 0) {
                    center.x = -DELTA_X;
                    center.y = 2 - DELTA_Y;
                } else if (i - CENTER_IMG_NUMBER == 15) {
                    center.x = 1 - DELTA_X;
                    center.y = 2 - DELTA_Y;
                } else {
                    if (i % TILE_WIDTH != 0) {
                        center.x = 2 - DELTA_X;
                        center.y = 2 - DELTA_Y;
                    }
                }
                graphics.drawImage(
                    img,
                    { x: center.x, y: center.y },
                    { width: 1, height: 1 }
                );
            }
        }

        // draw the player
        graphics.saveContext();
        graphics.rotateCanvas(model.localPosition, model.direction);
        graphics.drawImage(texture, model.localPosition, model.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
