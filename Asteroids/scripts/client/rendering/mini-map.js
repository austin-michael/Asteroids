// ------------------------------------------------------------------
//
// Rendering function for the mini map.
//
// ------------------------------------------------------------------
MyGame.renderer.miniMap = (function (graphics) {
    'use strict';
    let that = {};

    const TILE_WIDTH = 15;
    const TILE_HEIGHT = 9;
    const WINDOW_WIDTH = 600;
    const MINI_MAP_PIXEL_WIDTH = 150;
    const MINI_MAP_SIZE = { width: MINI_MAP_PIXEL_WIDTH / WINDOW_WIDTH, height: MINI_MAP_PIXEL_WIDTH / WINDOW_WIDTH * TILE_HEIGHT / TILE_WIDTH };
    const MINI_MAP_CENTER = { x: 1 - (.5 * MINI_MAP_SIZE.width), y: 1 - (.5 * MINI_MAP_SIZE.height) };

    const OBJECT_SIZE = { width: 3 / WINDOW_WIDTH, height: 3 / WINDOW_WIDTH }
    const LEFT_EDGE = 1 - (MINI_MAP_SIZE.width);
    const TOP_EDGE = 1 - (MINI_MAP_SIZE.height);

    let blackImg = MyGame.assets['black'];
    let playerSelfImg = MyGame.assets['green'];
    let playerOthersImg = MyGame.assets['white'];
    let asteroidsImg = MyGame.assets['red'];

    // ------------------------------------------------------------------
    //
    // Renders a Missile model.
    //
    // ------------------------------------------------------------------
    that.render = function (playerSelf, otherPlayers, asteroids) {
        graphics.drawImage(MyGame.assets['white'], MINI_MAP_CENTER, { width: MINI_MAP_SIZE.width + .01, height: MINI_MAP_SIZE.height + .01 });
        graphics.drawImage(blackImg, MINI_MAP_CENTER, MINI_MAP_SIZE);
        for (let asteroid in asteroids) {
            graphics.drawImage(asteroidsImg, { x: LEFT_EDGE + (asteroids[asteroid].position.x * MINI_MAP_SIZE.width), y: TOP_EDGE + (asteroids[asteroid].position.y * MINI_MAP_SIZE.height) }, OBJECT_SIZE)
        }
        graphics.drawImage(playerSelfImg, { x: LEFT_EDGE + (playerSelf.model.position.x * MINI_MAP_SIZE.width), y: TOP_EDGE + (playerSelf.model.position.y * MINI_MAP_SIZE.height) }, OBJECT_SIZE)
        for (let player in otherPlayers) {
            graphics.drawImage(playerOthersImg, { x: LEFT_EDGE + (otherPlayers[player].model.state.position.x * MINI_MAP_SIZE.width), y: TOP_EDGE + (otherPlayers[player].model.state.position.y * MINI_MAP_SIZE.height) }, OBJECT_SIZE)
        }
    };

    return that;

}(MyGame.graphics));
