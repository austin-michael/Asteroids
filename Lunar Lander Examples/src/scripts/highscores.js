MyGame.screens['high-scores'] = (function (game) {
    'use strict';

    function initialize() {
        let scrs = []
        for (let key in MyGame.persistence.highScores) {
            scrs.push(MyGame.persistence.highScores[key]);
        }
        scrs.sort(function (a, b) { return b - a }); // decending order
        for (let s in scrs) {
            let newScore = document.createElement('li');
            newScore.innerHTML = scrs[s];
            document.getElementById('high-score-list').append(newScore);
        }
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
    }

    function run() {
        let scrs = []
        for (let key in MyGame.persistence.highScores) {
            scrs.push(MyGame.persistence.highScores[key]);
        }
        scrs.sort(function (a, b) { return b - a }); // decending order
        document.getElementById('high-score-list').innerHTML = '';
        for (let s in scrs) {
            let newScore = document.createElement('li');
            newScore.innerHTML = scrs[s];
            document.getElementById('high-score-list').append(newScore);
        }
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));
