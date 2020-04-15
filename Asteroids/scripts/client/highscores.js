MyGame.screens['high-scores'] = (function () {
    'use strict';

    function initialize() {
        let scrs = []
        for (let key in MyGame.persistence.highScores) {
            scrs.push(MyGame.persistence.highScores[key]);
        }
        for (let s in scrs) {
            let newScore = document.createElement('li');
            newScore.innerHTML = scrs[s];
            document.getElementById('high-score-list').append(newScore);
        }
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function () { MyGame.game.showScreen('main-menu'); });
    }

    function run() {
        let scrs = []
        for (let key in MyGame.persistence.highScores) {
            scrs.push(MyGame.persistence.highScores[key].split(' '));
        }
        scrs.sort(function (a, b) { return parseInt(b[1]) - parseInt(a[1]) }); // decending order

        document.getElementById('high-score-list').innerHTML = '';
        for (let s in scrs) {
            let newScore = document.createElement('li');
            newScore.innerHTML = `${scrs[s][0]} ${scrs[s][1]}`;
            document.getElementById('high-score-list').append(newScore);
        }
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function () { MyGame.game.showScreen('main-menu'); });
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));
