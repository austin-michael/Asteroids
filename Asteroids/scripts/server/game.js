// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

let present = require('present');
let Player = require('./player');
let Missile = require('./missile');
let Asteroids = require('./asteroids');
let NetworkIds = require('../shared/network-ids');
let Queue = require('../shared/queue.js');

const SIMULATION_UPDATE_RATE_MS = 50;
const STATE_UPDATE_RATE_MS = 100;
let lastUpdate = 0;
let quit = false;
let activeClients = {};
let newMissiles = [];
let activeMissiles = [];
let hits = [];
let playerHits = [];
let inputQueue = Queue.create();
let nextMissileId = 1;
let activeAsteroids = [];
let newAsteroids = [];
let highscores = [];

//------------------------------------------------------------------
//
// Used to create a missile in response to user input.
//
//------------------------------------------------------------------
function createMissile(clientId, playerModel) {
    let missile = Missile.create({
        id: nextMissileId++,
        clientId: clientId,
        position: {
            x: playerModel.position.x,
            y: playerModel.position.y
        },
        direction: playerModel.direction,
        speed: playerModel.speed
    });

    newMissiles.push(missile);
}

//------------------------------------------------------------------
//
// Add a disconnected players highscore (top 5 scores persist)
//
//------------------------------------------------------------------
function addHighScore(username, score) {
    let newHighScores = []
    for (let i = 0 ; i < highscores.length; i++){
        newHighScores.push(highscores[i]);
    }
    newHighScores.push({username: username, score: score});
    newHighScores.sort(function (a, b) { return b.score - a.score }); // decending order

    if (newHighScores.length > 5){
        newHighScores.pop();
    }
    highscores = newHighScores;
    // console.log(highscores);
}

//------------------------------------------------------------------
//
// Process the network inputs we have received since the last time
// the game loop was processed.
//
//------------------------------------------------------------------
function processInput(elapsedTime) {
    //
    // Double buffering on the queue so we don't asynchronously receive inputs
    // while processing.
    let processMe = inputQueue;
    inputQueue = Queue.create();

    while (!processMe.empty) {
        let input = processMe.dequeue();
        let client = activeClients[input.clientId];
        client.lastMessageId = input.message.id;
        switch (input.message.type) {
            case NetworkIds.CREATE_PLAYER:
                break;
            case NetworkIds.INPUT_MOVE:
                client.player.move(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_ROTATE_LEFT:
                client.player.rotateLeft(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_ROTATE_RIGHT:
                client.player.rotateRight(input.message.elapsedTime);
                break;
            case NetworkIds.INPUT_FIRE:
                createMissile(input.clientId, client.player);
                break;
        }
    }
}

//------------------------------------------------------------------
//
// Utility function to perform a hit test between two objects.  The
// objects must have a position: { x: , y: } property and radius property.
//
//------------------------------------------------------------------
function collided(obj1, obj2) {
    let distance = Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2));
    let radii = obj1.radius + obj2.radius;

    return distance <= radii;
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime, currentTime) {
    for (let clientId in activeClients) {
        activeClients[clientId].player.update(currentTime);
    }

    for (let missile = 0; missile < newMissiles.length; missile++) {
        newMissiles[missile].update(elapsedTime);
    }

    for (let ast in activeAsteroids) {
        activeAsteroids[ast].update(elapsedTime);
    }

    let keepMissiles = [];
    for (let missile = 0; missile < activeMissiles.length; missile++) {
        //
        // If update returns false, that means the missile lifetime ended and
        // we don't keep it around any longer.
        if (activeMissiles[missile].update(elapsedTime)) {
            keepMissiles.push(activeMissiles[missile]);
        }
    }
    activeMissiles = keepMissiles;

    //
    // Check to see if any missiles collide with any asteroids. Friendly fire disabled.
    keepMissiles = [];
    for (let missile = 0; missile < activeMissiles.length; missile++) {
        let hit = false;
        for (let asteroidId in activeAsteroids) {
            if (collided(activeMissiles[missile], { position: activeAsteroids[asteroidId].position, radius: activeAsteroids[asteroidId].radius * .0008 })) {
                hit = true;
                hits.push({
                    asteroidId: activeAsteroids[asteroidId].id,
                    missileId: activeMissiles[missile].id,
                    position: activeAsteroids[asteroidId].position,
                    radius: activeAsteroids[asteroidId].radius,
                    playerId: activeMissiles[missile].clientId
                })
                if (activeAsteroids[asteroidId].radius > 1) {
                    let ast1 = Asteroids.create({ x: activeAsteroids[asteroidId].position.x, y: activeAsteroids[asteroidId].position.y, radius: activeAsteroids[asteroidId].radius });
                    let ast2 = Asteroids.create({ x: activeAsteroids[asteroidId].position.x, y: activeAsteroids[asteroidId].position.y, radius: activeAsteroids[asteroidId].radius });
                    let ast3 = Asteroids.create({ x: activeAsteroids[asteroidId].position.x, y: activeAsteroids[asteroidId].position.y, radius: activeAsteroids[asteroidId].radius });
                    newAsteroids.push(ast1);
                    newAsteroids.push(ast2);
                    newAsteroids.push(ast3);
                    activeAsteroids.push(ast1);
                    activeAsteroids.push(ast2);
                    activeAsteroids.push(ast3);
                }
                delete activeAsteroids[asteroidId];
                for (let playerId in activeClients) {
                    if (activeClients[playerId].player.clientId == activeMissiles[missile].clientId){
                        activeClients[playerId].player.score += 10
                        activeClients[playerId].player.reportUpdate = true;
                    }
                }
            }
        }
        if (!hit) {
            keepMissiles.push(activeMissiles[missile]);
        }
    }
    activeMissiles = keepMissiles;

    //
    // Check to see if any player collided with any asteroids.
    for (let playerId in activeClients) {
        for (let asteroidId in activeAsteroids) {
            if (collided(activeClients[playerId].player, { position: activeAsteroids[asteroidId].position, radius: activeAsteroids[asteroidId].radius * .002 })) {
                playerHits.push({
                    username: activeClients[playerId].player.username,
                    position: activeClients[playerId].player.position,
                    playerId: activeClients[playerId].clientId
                })
                activeClients[playerId].player.position = { x: .5, y: .5 }
                activeClients[playerId].player.score -= 100;
                activeClients[playerId].player.reportUpdate = true;
                // activeClients[playerId].player.beenHit = true;
                // activeClients[playerId].player.hitTimer = 2000;
            }
        }
    }
}

//------------------------------------------------------------------
//
// Send state of the game to any connected clients.
//
//------------------------------------------------------------------
function updateClients(elapsedTime) {
    //
    // For demonstration purposes, network updates run at a slower rate than
    // the game simulation.
    lastUpdate += elapsedTime;
    if (lastUpdate < STATE_UPDATE_RATE_MS) {
        return;
    }

    //
    // Build the missile messages one time, then reuse inside the loop
    let missileMessages = [];
    for (let item = 0; item < newMissiles.length; item++) {
        let missile = newMissiles[item];
        missileMessages.push({
            id: missile.id,
            direction: missile.direction,
            position: {
                x: missile.position.x,
                y: missile.position.y
            },
            radius: missile.radius,
            speed: missile.speed,
            timeRemaining: missile.timeRemaining
        });
    }

    //
    // Move all the new missiles over to the active missiles array
    for (let missile = 0; missile < newMissiles.length; missile++) {
        activeMissiles.push(newMissiles[missile]);
    }
    newMissiles.length = 0;

    for (let clientId in activeClients) {
        let client = activeClients[clientId];
        let update = {
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            direction: client.player.direction,
            position: client.player.position,
            updateWindow: lastUpdate,
            score: client.player.score
        };
        if (client.player.reportUpdate) {
            client.socket.emit(NetworkIds.UPDATE_SELF, update);

            //
            // Notify all other connected clients about every
            // other connected client status...but only if they are updated.
            for (let otherId in activeClients) {
                if (otherId !== clientId) {
                    activeClients[otherId].socket.emit(NetworkIds.UPDATE_OTHER, update);
                }
            }
        }

        //
        // Report any new missiles to the active clients
        for (let missile = 0; missile < missileMessages.length; missile++) {
            client.socket.emit(NetworkIds.MISSILE_NEW, missileMessages[missile]);
        }

        //
        // Report any missile hits to this client
        for (let hit = 0; hit < hits.length; hit++) {
            client.socket.emit(NetworkIds.MISSILE_HIT, hits[hit]);
        }

        //
        // Report any player/asteroid hits to this client
        for (let p = 0; p < playerHits.length; p++) {
            client.socket.emit(NetworkIds.PLAYER_HIT, playerHits[p]);
        }

        for (let ast = 0; ast < newAsteroids.length; ast++) {
            client.socket.emit(NetworkIds.ASTEROID_NEW, {
                speed: newAsteroids[ast].speed,
                id: newAsteroids[ast].id,
                position: newAsteroids[ast].position,
                direction: newAsteroids[ast].direction,
                radius: newAsteroids[ast].radius,
            });
        }


        //
        // Report any new asteroids to the active clients
        // for (let asteroid = 0; asteroid < Asteroids.length; asteroid++) {
        //     client.socket.emit(NetworkIds.ASTEROID_NEW, Asteroids[asteroid]);
        // }
    }
    newAsteroids = [];
    playerHits = [];

    for (let clientId in activeClients) {
        activeClients[clientId].player.reportUpdate = false;
    }

    //
    // Don't need these anymore, clean up
    hits.length = 0;
    //
    // Reset the elapsed time since last update so we can know
    // when to put out the next update.
    lastUpdate = 0;
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
    processInput(elapsedTime);
    update(elapsedTime, currentTime);
    updateClients(elapsedTime);

    if (!quit) {
        setTimeout(() => {
            let now = present();
            gameLoop(now, now - currentTime);
        }, SIMULATION_UPDATE_RATE_MS);
    }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeSocketIO(httpServer) {
    let io = require('socket.io')(httpServer);

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the arrival of this
    // new client.  Plus, tell the newly connected client about the
    // other players already connected.
    //
    //------------------------------------------------------------------
    function notifyConnect(socket, newPlayer) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (newPlayer.clientId !== clientId) {
                //
                // Tell existing about the newly connected player
                client.socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: newPlayer.clientId,
                    direction: newPlayer.direction,
                    position: newPlayer.position,
                    rotateRate: newPlayer.rotateRate,
                    speed: newPlayer.speed,
                    size: newPlayer.size,
                    username: newPlayer.username,
                    score: newPlayer.score
                });
                //
                // Tell the new player about the already connected player
                socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: client.player.clientId,
                    direction: client.player.direction,
                    position: client.player.position,
                    rotateRate: client.player.rotateRate,
                    speed: client.player.speed,
                    size: client.player.size,
                    username: activeClients[clientId].player.username,
                    score: activeClients[clientId].player.score
                });
            }
        }
        for (let asteroid in activeAsteroids) {
            socket.emit(NetworkIds.ASTEROID_NEW, {
                speed: activeAsteroids[asteroid].speed,
                id: activeAsteroids[asteroid].id,
                position: activeAsteroids[asteroid].position,
                direction: activeAsteroids[asteroid].direction,
                radius: activeAsteroids[asteroid].radius,
            })
        }
    }

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the disconnect of
    // another client.
    //
    //------------------------------------------------------------------
    function notifyDisconnect(playerId) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (playerId !== clientId) {
                client.socket.emit(NetworkIds.DISCONNECT_OTHER, {
                    clientId: playerId,
                    highscores: highscores
                });
            }
        }
    }

    function createServerPlayer(data, socket) {
        let newPlayer = Player.create(data.username)
        newPlayer.clientId = socket.id;
        activeClients[socket.id] = {
            socket: socket,
            player: newPlayer
        };

        socket.emit(NetworkIds.CONNECT_ACK, {
            direction: newPlayer.direction,
            position: newPlayer.position,
            size: newPlayer.size,
            rotateRate: newPlayer.rotateRate,
            speed: newPlayer.speed,
            username: newPlayer.username,
            highscores: highscores
        });

        socket.on(NetworkIds.INPUT, data => {
            inputQueue.enqueue({
                clientId: socket.id,
                message: data
            });
        });

        notifyConnect(socket, newPlayer);
    }

    io.on('connection', function (socket) {
        console.log('Connection established: ', socket.id);

        socket.emit(NetworkIds.INITIAL_CONNECT, {
            highscores: highscores
        })

        //
        // Create an entry in our list of connected clients
        socket.on(NetworkIds.CREATE_PLAYER, data => {
            createServerPlayer(data, socket);
        })

        socket.on('disconnect', function () {
            if (activeClients[socket.id] === undefined || activeClients[socket.id] === null) {
                delete activeClients[socket.id];
                notifyDisconnect(socket.id);
            }
            else {
                addHighScore(activeClients[socket.id].player.username, activeClients[socket.id].player.score);
                delete activeClients[socket.id];
                notifyDisconnect(socket.id);
            }
        });

    });
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {
    initializeSocketIO(httpServer);
    for (let i = 0; i < 500; i++) {
        activeAsteroids.push(Asteroids.create());
    }
    gameLoop(present(), 0);
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;
