MyGame.screens['game-play'] = (function (game, objects, renderer, graphics, input, persistence) {
    'use strict';

    console.log('game initializing...');

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let timer = 3000;
    let displayMsg = false;

    let bg = background(graphics, {
        bgImg: 'src/images/black.jpg',
        width: graphics.width,
        height: graphics.height
    });

    let safeSound = new Audio();
    safeSound.src = 'src/audio/safe.mp3';

    let level = 1;
    let score = 0;
    let msg = '';


    let spec = { playerIm: 'src/images/ship.png' };
    let ship = player(graphics, spec);

    // make a new game model based on current state.
    function createNewGame() {
        if (ship.safe && ship.landed && level == 1) {
            ship = player(graphics, spec);
            level = 2;
        } else if (!ship.safe && ship.landed) {
            ship = player(graphics, spec);
            score = 0;
            level = 1;
        } else if (ship.safe && ship.landed && level == 2) {
            msg = `You scored: ${score.toFixed(0)} Points.`
            MyGame.persistence.addHS(score, score.toFixed(0));
            level = 3;
        } else if (level == 3) {
            level = 1;
            score = 0;
            game.showScreen('main-menu');
            cancelNextRequest = true;
        }
    }

    // manage input
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    // manage game state
    function update(elapsedTime) {
        if (!displayMsg) {
            bg.update(elapsedTime);
            ship.update(elapsedTime);
            if (!ship.safe && ship.landed) {
                msg = '...This is only a simulation...';
                score = 0;
                requestAnimationFrame(displayMessage);
            } else if (ship.safe && ship.landed && level == 1) {
                msg = '...The eagle has landed...'
                score += ship.score * 1000;
                safeSound.play();
                requestAnimationFrame(displayMessage);
            } else if (ship.safe && ship.landed && level == 2) {
                score += ship.score * 1000
                safeSound.play();
                msg = `...Your journey is only beginning...`;
                requestAnimationFrame(displayMessage);
            }
        }
    }

    function render() {
        if (!displayMsg) {
            graphics.clear();
            bg.render();
            ship.render();
        }
    }

    function gameLoop(time) {
        if (cancelNextRequest) {
            graphics.clear();
            bg.render();
            return;
        }
        let elapsedTime = (time - lastTimeStamp);
        lastTimeStamp = time;
        processInput(elapsedTime);

        update(elapsedTime);

        render();

        requestAnimationFrame(gameLoop);
    };

    // helps render msg variable
    function displayMessage(time) {
        if (cancelNextRequest) {
            graphics.clear();
            bg.render();
            ship.render();
            return;
        }

        let elapsedTime = (time - lastTimeStamp);
        timer -= elapsedTime
        lastTimeStamp = time;

        displayMsg = true;
        graphics.clear();
        bg.render();
        ship.update(elapsedTime);
        ship.render();
        renderMsg();

        if (timer > 0) {
            requestAnimationFrame(displayMessage);
        } else {
            displayMsg = false;
            timer = 3000;
            createNewGame();
        }
    }
    // renders msg variable
    function renderMsg() {
        var number = Math.ceil(timer / 1000),
            cX = {
                font: '72px Arial, sans-serif',
                color: 'rgba(255, 255, 255, 1)',
                stroke: 'rgba(0, 0, 0, 1)',
                text: msg
            },
            textWidth = graphics.measureTextWidth(cX),
            textHeight = graphics.measureTextHeight(cX);

        cX.pos = { x: graphics.width / 2 - textWidth / 2, y: graphics.height / 2 - textHeight };

        //
        // Draw the countdown numbers
        graphics.drawText(cX);
    }

    // helps render timer variable
    function countdown(time) {
        if (cancelNextRequest) {
            graphics.clear();
            bg.render();
            return;
        }

        displayMsg = true;
        graphics.clear();
        bg.render();
        ship.render();
        renderCountdown();

        let elapsedTime = (time - lastTimeStamp);
        timer -= elapsedTime
        lastTimeStamp = time;

        if (timer > 0) {
            requestAnimationFrame(countdown);
        } else {
            displayMsg = false;
            myKeyboard.register(MyGame.persistence.controls['Rotate Right'], ship.rotateRight);
            myKeyboard.register(MyGame.persistence.controls['Rotate Left'], ship.rotateLeft);
            myKeyboard.register(MyGame.persistence.controls['Thrust'], ship.thrust);
            timer = 3000;
        }
    }

    // render timer variable
    function renderCountdown() {
        var number = Math.ceil(timer / 1000),
            cD = {
                font: '128px Arial, sans-serif',
                fill: 'rgba(0, 0, 255, 1)',
                stroke: 'rgba(0, 0, 0, 1)',
                text: number.toString()
            },
            textWidth = graphics.measureTextWidth(cD),
            textHeight = graphics.measureTextHeight(cD);

        cD.pos = { x: graphics.width / 2 - textWidth / 2, y: graphics.height / 2 - textHeight };

        //
        // Draw the countdown numbers
        graphics.drawText(cD);
    }


    function initialize() {
        myKeyboard.register('Escape', function () {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            game.showScreen('main-menu');
        });

        bg.render();
        let canvas = document.getElementById('id-canvas');
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        graphics.clear();

        ship = player(graphics, spec);

        displayMsg = false;
        myKeyboard.register(MyGame.persistence.controls['Rotate Right'], ship.rotateRight);
        myKeyboard.register(MyGame.persistence.controls['Rotate Left'], ship.rotateLeft);
        myKeyboard.register(MyGame.persistence.controls['Thrust'], ship.thrust);

        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));
