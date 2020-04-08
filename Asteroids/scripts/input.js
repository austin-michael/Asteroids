// ------------------------------------------------------------------
//
// This is the input handler used to distribute inputs to the game objects
//
// ------------------------------------------------------------------
MyGame.input = (function() {
    'use strict';

    function NetKeyboard(socket) {
        let that = {
                commands: [],
                handlers: []
            };

        // ------------------------------------------------------------------
        //
        // Allows the client code to register a keyboard handler
        //
        // ------------------------------------------------------------------
        that.registerCommand = function(command, handler) {
            that.handlers.push({ command : command, handler : handler});
        };
        
        // ------------------------------------------------------------------
        //
        // Allows the client to invoke all the handlers for the registered key/handlers.
        //
        // ------------------------------------------------------------------
        that.update = function() {
            for (let handler = 0; handler < that.handlers.length; handler++) {
                if (that.commands.hasOwnProperty(that.handlers[handler].command)) {
                    that.handlers[handler].handler(that.commands[that.handlers[handler].command].elapsedTime);
                }
            }

            that.commands = [];
        };

        socket.on('ack', function(data) {
            console.log('ack:', data);
        });

        socket.on('move', function(data) {
            that.commands['move-' + data.direction] = { elapsedTime: data.elapsedTime };
        });

        socket.on('rotate', function(data) {
            that.commands['rotate-' + data.direction] = { elapsedTime: data.elapsedTime };
        });

        socket.emit('display-connect', {});

        return that;
    }

    function Keyboard() {
        let that = {
                keys : {},
                handlers : []
            };

        function keyPress(e) {
            that.keys[e.key] = e.timeStamp;
        }

        function keyRelease(e) {
            delete that.keys[e.key];
        }

        // ------------------------------------------------------------------
        //
        // Allows the client code to register a keyboard handler
        //
        // ------------------------------------------------------------------
        that.registerCommand = function(key, handler) {
            that.handlers.push({ key : key, handler : handler});
        };

        // ------------------------------------------------------------------
        //
        // Allows the client to invoke all the handlers for the registered key/handlers.
        //
        // ------------------------------------------------------------------
        that.update = function(elapsedTime) {
            for (let handler = 0; handler < that.handlers.length; handler++) {
                if (that.keys.hasOwnProperty(that.handlers[handler].key)) {
                    that.handlers[handler].handler(elapsedTime);
                }
            }
        };

        //
        // These are used to keep track of which keys are currently pressed
        window.addEventListener('keydown', keyPress);
        window.addEventListener('keyup', keyRelease);
        
        return that;
    }

    return {
        Keyboard: Keyboard,
        NetKeyboard: NetKeyboard
    };
}());
