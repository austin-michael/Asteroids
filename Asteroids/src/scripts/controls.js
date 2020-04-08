MyGame.screens['controls'] = (function (game) {
    'use strict';

    function initialize() {
        for (let c in MyGame.persistence.controls) {
            let newItem = document.createElement('li');
            let newBtn = document.createElement('button')
            newBtn.id = c;
            newBtn.innerHTML = c + ': ' + MyGame.persistence.controls[c];
            // manage new controls.
            newBtn.addEventListener(
                'click',
                function () {
                    newBtn.innerHTML = c + ': ';
                    document.onkeydown = function (event) {
                        MyGame.persistence.changeCTRL(newBtn.id, event.key);
                        newBtn.innerHTML = c + ': ' + MyGame.persistence.controls[c];
                        newBtn.removeEventListener('click', document.onkeydown = function (event) { });
                    };
                }
            )
            newItem.append(newBtn);
            document.getElementById('controls-list').append(newItem);
        }
        document.getElementById('id-controls-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.querySelectorAll("button").forEach(function (item) {
            item.addEventListener('focus', function () {
                this.blur();
            })
        })
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
