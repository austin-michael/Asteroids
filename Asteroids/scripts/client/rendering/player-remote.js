// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function (graphics) {
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
    // Renders a PlayerRemote model.
    //
    // ------------------------------------------------------------------

    that.render = function (otherPlayerModel, texture, playerModel) {
        if (otherPlayerModel.state.position.x >= playerModel.position.x - (SINGLE_TILE_WIDTH / 2) &&
            otherPlayerModel.state.position.x <= playerModel.position.x + (SINGLE_TILE_WIDTH / 2) &&
            otherPlayerModel.state.position.y >= playerModel.position.y - (SINGLE_TILE_HEIGHT / 2) &&
            otherPlayerModel.state.position.y <= playerModel.position.y + (SINGLE_TILE_HEIGHT / 2)) {


            let otherX = (otherPlayerModel.state.position.x / SINGLE_TILE_WIDTH);
            let otherY = (otherPlayerModel.state.position.y / SINGLE_TILE_HEIGHT);

            let ourX = (playerModel.position.x / SINGLE_TILE_WIDTH);
            let ourY = (playerModel.position.y / SINGLE_TILE_HEIGHT);

            let localX = (playerModel.localPosition.x / SINGLE_TILE_WIDTH);
            let localY = (playerModel.localPosition.y / SINGLE_TILE_HEIGHT);

            let otherPlayerLocalPosition = {}
            if (Math.floor(ourX) < Math.floor(otherX)) {
                otherPlayerLocalPosition.x = (localX % 1) + (1-(ourX % 1) + (otherX % 1))
            } else if (Math.floor(ourX) == Math.floor(otherX)) {
                otherPlayerLocalPosition.x = (otherX % 1) - (ourX % 1) + (localX % 1);
            } else {
                otherPlayerLocalPosition.x = (localX % 1) - (1-(otherX % 1)) - (ourX % 1);
            }
            if (Math.floor(ourY) < Math.floor(otherY)) {
                otherPlayerLocalPosition.y = (localY % 1) + (1-(ourY % 1) + (otherY % 1))
            } else if (Math.floor(ourY) == Math.floor(otherY)) {
                otherPlayerLocalPosition.y = (otherY % 1) - (ourY % 1) + (localY % 1);
            } else {
                otherPlayerLocalPosition.y = (localY % 1) - (1-(otherY % 1)) - (ourY % 1);
            }

            console.log('X: ', otherPlayerLocalPosition.x);
            console.log('localX: ', localX);
            console.log('ourX: ', ourX);
            console.log('otherX: ', otherX);

            graphics.saveContext();
            graphics.rotateCanvas(otherPlayerLocalPosition, otherPlayerModel.state.direction);
            graphics.drawImage(texture, otherPlayerLocalPosition, otherPlayerModel.size);
            graphics.restoreContext();
        }
    };

    return that;

}(MyGame.graphics));
