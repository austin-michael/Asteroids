MyGame.screens['credits'] = (function () {
    'use strict';

    function initialize() {
        let schoolCred = document.createElement('li');
        schoolCred.innerHTML = 'Designed for USU CS5410 Spring 2020';
        schoolCred.className = 'credit';
        let myCred = document.createElement('li');
        myCred.innerHTML = 'Designed by Austin Williams & Brandon Smith';
        myCred.className = 'credit';

        document.getElementById('credits-list').append(schoolCred);
        document.getElementById('credits-list').append(myCred);

        document.getElementById('id-credits-back').addEventListener(
            'click',
            function () { MyGame.game.showScreen('main-menu'); });
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
