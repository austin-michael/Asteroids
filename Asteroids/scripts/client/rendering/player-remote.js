// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function (graphics) {
    'use strict';
    let that = {};
    
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
        if (otherPlayerModel.state.position.x >= playerModel.position.x - (SINGLE_TILE_WIDTH) &&
            otherPlayerModel.state.position.x <= playerModel.position.x + (SINGLE_TILE_WIDTH) &&
            otherPlayerModel.state.position.y >= playerModel.position.y - (SINGLE_TILE_HEIGHT) &&
            otherPlayerModel.state.position.y <= playerModel.position.y + (SINGLE_TILE_HEIGHT)) {


            let otherX = (otherPlayerModel.state.position.x / SINGLE_TILE_WIDTH);
            let otherY = (otherPlayerModel.state.position.y / SINGLE_TILE_HEIGHT);

            let ourX = (playerModel.position.x / SINGLE_TILE_WIDTH);
            let ourY = (playerModel.position.y / SINGLE_TILE_HEIGHT);

            let localX = (playerModel.localPosition.x);
            let localY = (playerModel.localPosition.y);

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

            graphics.saveContext();
            graphics.rotateCanvas(otherPlayerLocalPosition, otherPlayerModel.state.direction);
            graphics.drawImage(texture, otherPlayerLocalPosition, otherPlayerModel.size);
            graphics.restoreContext();
        }
    };

    return that;

}(MyGame.graphics));
