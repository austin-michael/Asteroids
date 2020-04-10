//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let socket = io();

    socket.on('ack', function(data) {
        console.log('ack: ', data);
    });

    function moveLeft(elapsedTime) {
        socket.emit('move', {
            direction: 'left',
            elapsedTime: elapsedTime
        });
    }

    function moveRight(elapsedTime) {
        socket.emit('move', {
            direction: 'right',
            elapsedTime: elapsedTime
        });
    }

    function moveUp(elapsedTime) {
        socket.emit('move', {
            direction: 'up',
            elapsedTime: elapsedTime
        });
    }

    function moveDown(elapsedTime) {
        socket.emit('move', {
            direction: 'down',
            elapsedTime: elapsedTime
        });
    }

    function rotateLeft(elapsedTime) {
        socket.emit('rotate', {
            direction: 'left',
            elapsedTime: elapsedTime
        });
    }

    function rotateRight(elapsedTime) {
        socket.emit('rotate', {
            direction: 'right',
            elapsedTime: elapsedTime
        });
    }

    //------------------------------------------------------------------
    //
    // Process the registered input handlers here.
    //
    //------------------------------------------------------------------
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
    }

    function render() {
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };

    console.log('game initializing...');

    //
    // Create the keyboard input handler and register the keyboard commands
    myKeyboard.registerCommand('a', moveLeft);
    myKeyboard.registerCommand('d', moveRight);
    myKeyboard.registerCommand('w', moveUp);
    myKeyboard.registerCommand('s', moveDown);
    myKeyboard.registerCommand('q', rotateLeft);
    myKeyboard.registerCommand('e', rotateRight);

    myKeyboard.registerCommand('j', moveLeft);
    myKeyboard.registerCommand('l', moveRight);
    myKeyboard.registerCommand('i', moveUp);
    myKeyboard.registerCommand('k', moveDown);
    myKeyboard.registerCommand('p', rotateLeft);
    myKeyboard.registerCommand('u', rotateRight);

    //
    // Get the game loop started
    requestAnimationFrame(gameLoop);
}(MyGame.input));
