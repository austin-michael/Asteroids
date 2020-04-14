//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.screens['game-play'] = (function (graphics, renderer, input, components) {
    'use strict';

    let lastTimeStamp = performance.now(),
        myKeyboard = input.Keyboard(),
        playerSelf = {
            model: components.Player(),
            texture: MyGame.assets['player-self']
        },
        playerOthers = {},
        missiles = {},
        asteroids = {},

        explosions = {},
        messageHistory = Queue.create(),
        messageId = 1,
        nextExplosionId = 1,
        socket = io(),
        networkQueue = Queue.create(),
        cancelNextRequest = true;


    socket.on(NetworkIds.CONNECT_ACK, data => {
        networkQueue.enqueue({
            type: NetworkIds.CONNECT_ACK,
            data: data
        });
    });

    socket.on(NetworkIds.CONNECT_OTHER, data => {
        networkQueue.enqueue({
            type: NetworkIds.CONNECT_OTHER,
            data: data
        });
    });

    socket.on(NetworkIds.DISCONNECT_OTHER, data => {
        networkQueue.enqueue({
            type: NetworkIds.DISCONNECT_OTHER,
            data: data
        });
    });

    socket.on(NetworkIds.UPDATE_SELF, data => {
        networkQueue.enqueue({
            type: NetworkIds.UPDATE_SELF,
            data: data
        });
    });

    socket.on(NetworkIds.UPDATE_OTHER, data => {
        networkQueue.enqueue({
            type: NetworkIds.UPDATE_OTHER,
            data: data
        });
    });

    socket.on(NetworkIds.MISSILE_NEW, data => {
        networkQueue.enqueue({
            type: NetworkIds.MISSILE_NEW,
            data: data
        });
    });

    socket.on(NetworkIds.MISSILE_HIT, data => {
        networkQueue.enqueue({
            type: NetworkIds.MISSILE_HIT,
            data: data
        });
    });

    socket.on(NetworkIds.ASTEROID_NEW, data => {
        networkQueue.enqueue({
            type: NetworkIds.ASTEROID_NEW,
            data: data
        });
    });


    //------------------------------------------------------------------
    //
    // Handler for when the server ack's the socket connection.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    function connectPlayerSelf(data) {
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;
        playerSelf.model.window.x = data.position.x;
        playerSelf.model.window.y = data.position.y;

        playerSelf.model.size.x = data.size.x;
        playerSelf.model.size.y = data.size.y;

        playerSelf.model.direction = data.direction;
        playerSelf.model.speed = data.speed;
        playerSelf.model.rotateRate = data.rotateRate;
        playerSelf.model.username = data.username;
    }

    //------------------------------------------------------------------
    //
    // Handler for when a new player connects to the game.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    function connectPlayerOther(data) {
        let model = components.PlayerRemote();
        model.state.position.x = data.position.x;
        model.state.position.y = data.position.y;
        model.state.direction = data.direction;
        model.state.lastUpdate = performance.now();
        model.state.username = data.username;

        model.goal.position.x = data.position.x;
        model.goal.position.y = data.position.y;
        model.goal.direction = data.direction;
        model.goal.updateWindow = 0;

        model.size.x = data.size.x;
        model.size.y = data.size.y;

        playerOthers[data.clientId] = {
            model: model,
            texture: MyGame.assets['player-other']
        };

    }

    //------------------------------------------------------------------
    //
    // Handler for when another player disconnects from the game.
    //
    //------------------------------------------------------------------
    function disconnectPlayerOther(data) {
        delete playerOthers[data.clientId];
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about the self player.
    //
    //------------------------------------------------------------------
    function updatePlayerSelf(data) {
        // for (let p in playerOthers){
        //     console.log(playerOthers[p].model.state.username);
        // }
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;
        playerSelf.model.direction = data.direction;

        //
        // Remove messages from the queue up through the last one identified
        // by the server as having been processed.
        let done = false;
        while (!done && !messageHistory.empty) {
            if (messageHistory.front.id === data.lastMessageId) {
                done = true;
            }
            messageHistory.dequeue();
        }

        //
        // Update the client simulation since this last server update, by
        // replaying the remaining inputs.
        let memory = Queue.create();
        while (!messageHistory.empty) {
            let message = messageHistory.dequeue();
            switch (message.type) {
                case NetworkIds.MOVE:
                    playerSelf.model.move(message.elapsedTime);
                    break;
                case NetworkIds.ROTATE_RIGHT:
                    playerSelf.model.rotateRight(message.elapsedTime);
                    break;
                case NetworkIds.ROTATE_LEFT:
                    playerSelf.model.rotateLeft(message.elapsedTime);
                    break;
            }
            memory.enqueue(message);
        }
        messageHistory = memory;
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about other players.
    //
    //------------------------------------------------------------------
    function updatePlayerOther(data) {
        if (playerOthers.hasOwnProperty(data.clientId)) {
            let model = playerOthers[data.clientId].model;
            model.goal.updateWindow = data.updateWindow;

            model.goal.position.x = data.position.x;
            model.goal.position.y = data.position.y
            model.goal.direction = data.direction;
        }
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving notice of a new missile in the environment.
    //
    //------------------------------------------------------------------
    function missileNew(data) {
        missiles[data.id] = components.Missile({
            id: data.id,
            radius: data.radius,
            speed: data.speed,
            direction: data.direction,
            position: {
                x: data.position.x,
                y: data.position.y
            },
            timeRemaining: data.timeRemaining
        });
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving notice of a new asteroid in the environment.
    //
    //------------------------------------------------------------------
    function asteroidNew(data) {
        console.log(data);
        asteroids[data.id] = components.Asteroid({
            id: data.id,
            radius: data.radius,
            speed: data.speed,
            direction: data.direction,
            position: {
                x: data.position.x,
                y: data.position.y
            },
        });
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving notice that a missile has hit a player.
    //
    //------------------------------------------------------------------
    function missileHit(data) {
        explosions[nextExplosionId] = components.AnimatedSprite({
            id: nextExplosionId++,
            spriteSheet: MyGame.assets['explosion'],
            spriteSize: { width: 0.07 * data.radius, height: 0.07 * data.radius },
            spriteCenter: data.position,
            spriteCount: 16,
            spriteTime: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
        });

        //
        // When we receive a hit notification, go ahead and remove the
        // associated missle from the client model.
        delete missiles[data.missileId];
        delete asteroids[data.asteroidId];
    }

    //------------------------------------------------------------------
    //
    // Process the registered input handlers here.
    //
    //------------------------------------------------------------------
    function processInput(elapsedTime) {
        //
        // Start with the keyboard updates so those messages can get in transit
        // while the local updating of received network messages are processed.
        myKeyboard.update(elapsedTime);

        //
        // Double buffering on the queue so we don't asynchronously receive messages
        // while processing.
        let processMe = networkQueue;
        networkQueue = networkQueue = Queue.create();
        while (!processMe.empty) {
            let message = processMe.dequeue();
            switch (message.type) {
                case NetworkIds.CONNECT_ACK:
                    connectPlayerSelf(message.data);
                    break;
                case NetworkIds.CONNECT_OTHER:
                    connectPlayerOther(message.data);
                    break;
                case NetworkIds.DISCONNECT_OTHER:
                    disconnectPlayerOther(message.data);
                    break;
                case NetworkIds.UPDATE_SELF:
                    updatePlayerSelf(message.data);
                    break;
                case NetworkIds.UPDATE_OTHER:
                    updatePlayerOther(message.data);
                    break;
                case NetworkIds.MISSILE_NEW:
                    missileNew(message.data);
                    break;
                case NetworkIds.MISSILE_HIT:
                    missileHit(message.data);
                    break;
                case NetworkIds.ASTEROID_NEW:
                    asteroidNew(message.data);
                    break;
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Update the game simulation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        playerSelf.model.update(elapsedTime);
        for (let id in playerOthers) {
            playerOthers[id].model.update(elapsedTime);
        }

        let removeMissiles = [];
        for (let missile in missiles) {
            if (!missiles[missile].update(elapsedTime)) {
                removeMissiles.push(missiles[missile]);
            }
        }

        for (let missile = 0; missile < removeMissiles.length; missile++) {
            delete missiles[removeMissiles[missile].id];
        }

        for (let id in explosions) {
            if (!explosions[id].update(elapsedTime)) {
                delete explosions[id];
            }
        }

        for (let ast in asteroids) {
            asteroids[ast].update(elapsedTime);
        }
    }

    //------------------------------------------------------------------
    //
    // Render the current state of the game simulation
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        if (cancelNextRequest) {
            return;
        }
        renderer.Player.render(playerSelf.model, playerSelf.texture);
        for (let id in playerOthers) {
            let player = playerOthers[id];
            renderer.PlayerRemote.render(player.model, player.texture, playerSelf.model);
        }

        for (let missile in missiles) {
            renderer.Missile.render(missiles[missile], playerSelf.model);
        }

        for (let ast in asteroids) {
            renderer.Asteroid.render(asteroids[ast], playerSelf.model, MyGame.assets['asteroid']);
        }

        for (let id in explosions) {
            renderer.AnimatedSprite.render(explosions[id], playerSelf.model);
        }

        renderer.miniMap.render(playerSelf, playerOthers, asteroids);
    }

    //------------------------------------------------------------------
    //
    // Client-side game loop
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };

    //------------------------------------------------------------------
    //
    // Public function used to get the game initialized and then up
    // and running.
    //
    //------------------------------------------------------------------
    function initialize() {
        console.log('game initializing...');

        //
        // Get the game loop started
    }
    function run() {
        //
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: NetworkIds.INPUT_MOVE
            };
            socket.emit(NetworkIds.INPUT, message);
            messageHistory.enqueue(message);
            playerSelf.model.move(elapsedTime);
        },
            MyGame.persistence.controls['Thrust'], true);

        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: NetworkIds.INPUT_ROTATE_RIGHT
            };
            socket.emit(NetworkIds.INPUT, message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateRight(elapsedTime);
        },
            MyGame.persistence.controls['Rotate Right'], true);

        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: NetworkIds.INPUT_ROTATE_LEFT
            };
            socket.emit(NetworkIds.INPUT, message);
            messageHistory.enqueue(message);
            playerSelf.model.rotateLeft(elapsedTime);
        },
            MyGame.persistence.controls['Rotate Left'], true);

        myKeyboard.registerHandler(elapsedTime => {
            let message = {
                id: messageId++,
                elapsedTime: elapsedTime,
                type: NetworkIds.INPUT_FIRE
            };
            socket.emit(NetworkIds.INPUT, message);
        },
            MyGame.persistence.controls['Fire'], false);

        // myKeyboard.registerHandler(elapsedTime => {
        //     let message = {
        //         id: messageId++,
        //         elapsedTime: elapsedTime,
        //         type: NetworkIds.INPUT_FIRE
        //     };
        //     //socket.emit(NetworkIds.INPUT, message);
        //     cancelNextRequest = true;
        //     MyGame.game.showScreen('main-menu');
        // },
        //     'Escape', false);

        cancelNextRequest = false;
        socket.emit(NetworkIds.CREATE_PLAYER, { username: MyGame.username });
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components));

// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

MyGame.game = (function (screens) {
    'use strict';

    //------------------------------------------------------------------
    //
    // This function is used to change to a new active screen.
    //
    //------------------------------------------------------------------
    function showScreen(id) {
        //
        // Remove the active state from all screens.  There should only be one...
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }
        //
        // Tell the screen to start actively running
        screens[id].run();
        //
        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }

    //------------------------------------------------------------------
    //
    // This function performs the one-time game initialization.
    //
    //------------------------------------------------------------------
    function initialize() {
        let screen = null;
        //
        // Go through each of the screens and tell them to initialize
        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }
        //
        // Make the main-menu screen the active one
        showScreen('main-menu');
    }

    return {
        initialize: initialize,
        showScreen: showScreen
    };
}(MyGame.screens));

