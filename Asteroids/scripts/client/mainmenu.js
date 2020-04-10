MyGame.screens['main-menu'] = (function (game) {
    'use strict';

    console.log("MyGame.screens Made it here")

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function () { 
                MyGame.username = document.getElementById('username').value;
                game.showScreen('game-play'); 
            });

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function () { game.showScreen('high-scores'); });

        document.getElementById('id-controls').addEventListener(
            'click',
            function () { game.showScreen('controls'); });

        document.getElementById('id-credits').addEventListener(
            'click',
            function () { game.showScreen('credits'); });

    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));
