MyGame.graphics = (function () {
    'use strict';

    var canvas = document.getElementById('id-canvas');
    var context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    rotation:     // radians
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
    }

    // --------------------------------------------------------------
    //
    // Draw a rectangle to the canvas with the following attributes:
    //      center: { x: , y: },
    //      size: { x: , y: },
    //      rotation:       // radians
    //
    // --------------------------------------------------------------
    function drawRectangle(rect) {
        context.save();
        context.translate(rect.center.x, rect.center.y);
        context.rotate(rect.rotation);
        context.translate(-rect.center.x, -rect.center.y);

        context.fillStyle = rect.fill;
        context.fillRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

        context.strokeStyle = rect.stroke;
        context.strokeRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

        context.restore();
    }

    // --------------------------------------------------------------
    //
    // Draw and fill a terrain to the canvas with the following attributes:
    //      terrain: [{x: , y:}, ...],
    //      bottomBoundry: y,
    //
    // --------------------------------------------------------------
    function drawTerrain(spec) {
        context.beginPath();
        context.moveTo(spec.terrain[0].x, spec.terrain[0].y);
        for (let i = 1; i < spec.terrain.length; i++) {
            context.lineTo(spec.terrain[i].x, spec.terrain[i].y);
        }
        context.lineTo(spec.terrain[spec.terrain.length - 1].x, spec.bottomBoundry);
        context.lineTo(spec.terrain[0].x, spec.bottomBoundry);
        context.closePath();

        context.fillStyle = 'rgb(0,0,0)';
        context.strokeStyle = 'rgb(255,255,255)'
        context.lineWidth = 2;
        context.fill();
        context.stroke();
    }

    //
    // Draw Text Given the following attributes:
    //      text: Print Me,
    //      color: color,
    //      pos: {x: , y:},
    //      font: font
    //
    // --------------------------------------------------------------
    function drawText(spec) {
        context.font = spec.font;
        context.fillStyle = spec.color;
        context.fillText(spec.text, spec.pos.x, spec.pos.y);
    }

    //------------------------------------------------------------------
    //
    // Returns the width of the specified text, in pixels.
    //
    //------------------------------------------------------------------
    function measureTextWidth(spec) {
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fill;
        if (spec.hasOwnProperty('stroke')) {
            context.strokeStyle = spec.stroke;
        }
        var width = context.measureText(spec.text).width;

        context.restore();

        return width;
    }

    //------------------------------------------------------------------
    //
    // Returns the height of the specified text, in pixels.
    //
    //------------------------------------------------------------------
    function measureTextHeight(spec) {
        var saveText = spec.text;

        spec.text = 'm';	// Clever trick to get font height
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fill;
        if (spec.hasOwnProperty('stroke')) {
            context.strokeStyle = spec.stroke;
        }
        var width = context.measureText(spec.text).width;
        spec.text = saveText;

        context.restore();

        return width;
    }


    let api = {
        clear: clear,
        drawTexture: drawTexture,
        drawRectangle: drawRectangle,
        drawTerrain: drawTerrain,
        width: canvas.width,
        height: canvas.height,
        drawText: drawText,
        measureTextWidth: measureTextWidth,
        measureTextHeight: measureTextHeight,
    };

    return api;
}());
