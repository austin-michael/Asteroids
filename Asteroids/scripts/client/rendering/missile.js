// ------------------------------------------------------------------
//
// Rendering function for a Missile object.
//
// ------------------------------------------------------------------
MyGame.renderer.Missile = (function (graphics) {
    'use strict';
    let that = {};

    const TILE_WIDTH = 15;
    const TILE_HEIGHT = 9;
    const SINGLE_TILE_WIDTH = 1 / TILE_WIDTH;
    const SINGLE_TILE_HEIGHT = 1 / TILE_HEIGHT;

    // ------------------------------------------------------------------
    //
    // Renders a Missile model.
    //
    // ------------------------------------------------------------------
    that.render = function (model, playerModel, texture) {
        if (model.position.x >= playerModel.position.x - (SINGLE_TILE_WIDTH) &&
            model.position.x <= playerModel.position.x + (SINGLE_TILE_WIDTH) &&
            model.position.y >= playerModel.position.y - (SINGLE_TILE_HEIGHT) &&
            model.position.y <= playerModel.position.y + (SINGLE_TILE_HEIGHT)) {

            let otherX = (model.position.x / SINGLE_TILE_WIDTH);
            let otherY = (model.position.y / SINGLE_TILE_HEIGHT);

            let ourX = (playerModel.position.x / SINGLE_TILE_WIDTH);
            let ourY = (playerModel.position.y / SINGLE_TILE_HEIGHT);

            let localX = (playerModel.localPosition.x);
            let localY = (playerModel.localPosition.y);

            let missleLocalPosition = {}
            if (Math.floor(ourX) < Math.floor(otherX)) {
                missleLocalPosition.x = (localX % 1) + (1 - (ourX % 1) + (otherX % 1))
            } else if (Math.floor(ourX) == Math.floor(otherX)) {
                missleLocalPosition.x = (otherX % 1) - (ourX % 1) + (localX % 1);
            } else {
                missleLocalPosition.x = (localX % 1) - (1 - (otherX % 1)) - (ourX % 1);
            }
            if (Math.floor(ourY) < Math.floor(otherY)) {
                missleLocalPosition.y = (localY % 1) + (1 - (ourY % 1) + (otherY % 1))
            } else if (Math.floor(ourY) == Math.floor(otherY)) {
                missleLocalPosition.y = (otherY % 1) - (ourY % 1) + (localY % 1);
            } else {
                missleLocalPosition.y = (localY % 1) - (1 - (otherY % 1)) - (ourY % 1);
            }

            graphics.drawCircle(missleLocalPosition, model.radius, '#FFFFFF');
        }
    };

    return that;

}(MyGame.graphics));
