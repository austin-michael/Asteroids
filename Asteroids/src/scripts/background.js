function background(graphics, spec) {
    let that = {};

    let isReady = false;

    let bgImg = new Image();
    bgImg.src = spec.bgImg;
    bgImg.onload = function () {
        isReady = true;
    }

    let center = { x: spec.width / 2, y: spec.height / 2 };
    let size = { x: spec.width, y: spec.height };

    that.update = function (elapsedTime) {
        center = { x: graphics.width / 2, y: graphics.height / 2 };
        size = { x: graphics.width, y: graphics.height };
    }

    that.render = function () {
        if (isReady) {
            graphics.drawTexture(bgImg, center, 0, size);
        }
    }

    return that;
}