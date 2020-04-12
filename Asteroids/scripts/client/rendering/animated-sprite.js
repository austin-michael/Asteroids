// ------------------------------------------------------------------
//
// Rendering function for an AnimatedSprite object.
//
// ------------------------------------------------------------------
MyGame.renderer.AnimatedSprite = (function (graphics) {
    'use strict';
    let that = {};

    const TILE_WIDTH = 15;
    const TILE_HEIGHT = 9;
    const SINGLE_TILE_WIDTH = 1 / TILE_WIDTH;
    const SINGLE_TILE_HEIGHT = 1 / TILE_HEIGHT;

    that.render = function (sprite, playerModel) {

        if (sprite.center.x >= playerModel.position.x - (SINGLE_TILE_WIDTH) &&
            sprite.center.x <= playerModel.position.x + (SINGLE_TILE_WIDTH) &&
            sprite.center.y >= playerModel.position.y - (SINGLE_TILE_HEIGHT) &&
            sprite.center.y <= playerModel.position.y + (SINGLE_TILE_HEIGHT)) {

            let otherX = (sprite.center.x / SINGLE_TILE_WIDTH);
            let otherY = (sprite.center.y / SINGLE_TILE_HEIGHT);

            let ourX = (playerModel.position.x / SINGLE_TILE_WIDTH);
            let ourY = (playerModel.position.y / SINGLE_TILE_HEIGHT);

            let localX = (playerModel.localPosition.x);
            let localY = (playerModel.localPosition.y);

            let spriteLocalPosition = {}
            if (Math.floor(ourX) < Math.floor(otherX)) {
                spriteLocalPosition.x = (localX % 1) + (1 - (ourX % 1) + (otherX % 1))
            } else if (Math.floor(ourX) == Math.floor(otherX)) {
                spriteLocalPosition.x = (otherX % 1) - (ourX % 1) + (localX % 1);
            } else {
                spriteLocalPosition.x = (localX % 1) - (1 - (otherX % 1)) - (ourX % 1);
            }
            if (Math.floor(ourY) < Math.floor(otherY)) {
                spriteLocalPosition.y = (localY % 1) + (1 - (ourY % 1) + (otherY % 1))
            } else if (Math.floor(ourY) == Math.floor(otherY)) {
                spriteLocalPosition.y = (otherY % 1) - (ourY % 1) + (localY % 1);
            } else {
                spriteLocalPosition.y = (localY % 1) - (1 - (otherY % 1)) - (ourY % 1);
            }

            graphics.drawImageSpriteSheet(
                sprite.spriteSheet,
                { width: sprite.pixelWidth, height: sprite.pixelHeight },
                sprite.sprite,
                { x: spriteLocalPosition.x, y: spriteLocalPosition.y },
                { width: sprite.width, height: sprite.height }
            );
        }
    };

    return that;
}(MyGame.graphics));
