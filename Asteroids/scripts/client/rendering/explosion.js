// ------------------------------------------------------------------
//
// Rendering function for an Explosion.
//
// ------------------------------------------------------------------
MyGame.renderer.Explosion = (function (graphics) {
    'use strict';
    let that = {};

    const TILE_WIDTH = 15;
    const TILE_HEIGHT = 9;
    const SINGLE_TILE_WIDTH = 1 / TILE_WIDTH;
    const SINGLE_TILE_HEIGHT = 1 / TILE_HEIGHT;

    // ------------------------------------------------------------------
    //
    // Renders an Asteroid model.
    //
    // ------------------------------------------------------------------
    that.render = function (asteroid, playerModel) {
        if (asteroid.position.x >= playerModel.position.x - (SINGLE_TILE_WIDTH) &&
            asteroid.position.x <= playerModel.position.x + (SINGLE_TILE_WIDTH) &&
            asteroid.position.y >= playerModel.position.y - (SINGLE_TILE_HEIGHT) &&
            asteroid.position.y <= playerModel.position.y + (SINGLE_TILE_HEIGHT)) {

            let otherX = (asteroid.position.x / SINGLE_TILE_WIDTH);
            let otherY = (asteroid.position.y / SINGLE_TILE_HEIGHT);

            let ourX = (playerModel.position.x / SINGLE_TILE_WIDTH);
            let ourY = (playerModel.position.y / SINGLE_TILE_HEIGHT);

            let localX = (playerModel.localPosition.x);
            let localY = (playerModel.localPosition.y);

            let asteroidLocalPosition = {}
            if (Math.floor(ourX) < Math.floor(otherX)) {
                asteroidLocalPosition.x = (localX % 1) + (1 - (ourX % 1) + (otherX % 1))
            } else if (Math.floor(ourX) == Math.floor(otherX)) {
                asteroidLocalPosition.x = (otherX % 1) - (ourX % 1) + (localX % 1);
            } else {
                asteroidLocalPosition.x = (localX % 1) - (1 - (otherX % 1)) - (ourX % 1);
            }
            if (Math.floor(ourY) < Math.floor(otherY)) {
                asteroidLocalPosition.y = (localY % 1) + (1 - (ourY % 1) + (otherY % 1))
            } else if (Math.floor(ourY) == Math.floor(otherY)) {
                asteroidLocalPosition.y = (otherY % 1) - (ourY % 1) + (localY % 1);
            } else {
                asteroidLocalPosition.y = (localY % 1) - (1 - (otherY % 1)) - (ourY % 1);
            }
            graphics.saveContext();
            graphics.drawImage(texture, asteroidLocalPosition, {width: .05 * asteroid.radius, height: .05 * asteroid.radius});
            graphics.restoreContext();
        }
    };

    return that;

}(MyGame.graphics));