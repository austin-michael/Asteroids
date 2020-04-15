// ------------------------------------------------------------------
//
// Rendering function for the scoreboard.
//
// ------------------------------------------------------------------
MyGame.renderer.scoreboard = (function (graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a scoreboard model.
    //
    // ------------------------------------------------------------------
    that.render = function (playerSelf, playerOthers) {
        
        let text = {
            text: `${playerSelf.model.username}: ${playerSelf.model.score}`,
            color: `rgb(255,255,255)`,
            xPos: 20,
            yPos: 20
        }
        
        graphics.drawText(text);
        
        for (let player in playerOthers) {
            let y = text.yPos + 20;
            text = {
                text: `${playerOthers[player].model.state.username}: ${playerOthers[player].model.state.score}`,
                color: `rgb(255,255,255)`,
                xPos: 20,
                yPos: y
            }    

            graphics.drawText(text);
        }


    };

    return that;

}(MyGame.graphics));
