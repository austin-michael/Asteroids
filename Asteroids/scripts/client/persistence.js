// Thanks Dean
MyGame.persistence = (function (game) {
    'use strict';
    let highScores = {};
    let controls = {};

    let previousScores = localStorage.getItem('MyGame.highScores');
    let previousControls = localStorage.getItem('MyGame.controls');

    // get previous highscores and controls or add controls if none.
    if (previousScores !== null) {
        localStorage['MyGame.highScores'] = '';
    }
    if (previousControls !== null && previousControls.length > 2) {
        controls = JSON.parse(previousControls);
    } else {
        controls['Rotate Right'] = 'ArrowRight';
        controls['Rotate Left'] = 'ArrowLeft';
        controls['Thrust'] = 'ArrowUp';
        controls['Fire'] = ' ';
        localStorage['MyGame.controls'] = JSON.stringify(controls);
    }

    // adds a new highscore to the system (5 max)
    function addHS(key, value) {
        highScores[key] = value;
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
        let minKey = key;
        let counter = 0;
        for (let score in highScores) {
            if (parseInt(highScores[score].key) < parseInt(minKey.toString())) {
                minKey = score;
            }
            counter++;
        }
        if (counter > 5) {
            removeHS(minKey);
        }
    }

    // change current control in persistence
    function changeCTRL(key, value) {
        controls[key] = value;
        localStorage['MyGame.controls'] = JSON.stringify(controls);
    }

    // remove a highscore from persistence
    function removeHS(key) {
        delete highScores[key];
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }

    // reports highscores to the console.
    function reportHS() {
        let htmlNode = document.getElementById('div-console');

        htmlNode.innerHTML = '';
        for (let key in highScores) {
            htmlNode.innerHTML += ('Key: ' + key + ' Value: ' + highScores[key] + '<br/>');
        }
        htmlNode.scrollTop = htmlNode.scrollHeight;
    }

    return {
        addHS: addHS,
        changeCTRL: changeCTRL,
        removeHS: removeHS,
        reportHS: reportHS,
        highScores: highScores,
        controls: controls
    };
}());