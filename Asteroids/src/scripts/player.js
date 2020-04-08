function player(graphics, spec) {
    let that = {}

    let isReady = false;
    let thrustOK = false;

    let playerIm = new Image();
    playerIm.src = spec.playerIm;
    playerIm.onload = function () {
        isReady = true;
    }
    let imageFire = new Image();
    imageFire.src = 'src/images/fire.png';
    let imageSmoke = new Image();
    imageSmoke.src = 'src/images/smoke.png';

    let thrustSound = new Audio();
    thrustSound.src = 'src/audio/thrust.mp3';
    thrustSound.loop = true;
    thrustSound.addEventListener('canplay', handleThrust())

    let explosionSound = new Audio();
    explosionSound.src = 'src/audio/explosion.mp3';

    // thrust event handler
    function handleThrust() {
        document.onkeydown = function (event) {
            // console.log(event);
            if (event.key == MyGame.persistence.controls['Thrust']) {
                //  console.log('play');
                if (thrustOK == true) {
                    thrustSound.play();
                }
            }
        }
        document.onkeyup = function (event) {
            if (event.key == MyGame.persistence.controls['Thrust']) {
                // console.log('pause');
                thrustSound.pause();
            }
        }
    }

    let center = { x: graphics.width / 4, y: graphics.height / 10 };
    size = { x: graphics.height / 15, y: graphics.height / 15 };
    center.radius = size.y / 2;
    let rotation = 3 * Math.PI / 2;

    let accY = 0;
    let accX = 0;
    that.score = 0;

    // generate thrust and explosion particle systems.
    let particleSystem = ParticleSystem(graphics, {
        image: imageFire,
        center: { x: center.x, y: center.y },
        size: { mean: 10, stdev: 3 },
        speed: { mean: .2, stdev: 0.1 },
        lifetime: { mean: 500, stdev: 150 }
    });
    let particleSystemSmoke = ParticleSystem(graphics, {
        image: imageSmoke,
        center: { x: center.x, y: center.y },
        size: { mean: 10, stdev: 3 },
        speed: { mean: 0, stdev: 0.1 },
        lifetime: { mean: 1000, stdev: 250 }
    });

    renderPS = false;

    that.landed = false;

    // test for collisions
    function lineCircleIntersection(pt1, pt2, center) {
        let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
        let v2 = { x: pt1.x - center.x, y: pt1.y - center.y };
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c = 2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - center.radius * center.radius));
        if (isNaN(d)) { // no intercept
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
            return true;
        }
        return false;
    }

    // renders speed, and current rotation of the player.
    function drawStatus() {
        let speed = {};
        let angle = {};

        let ms = (4 * Math.sqrt(Math.pow(accX, 2) + Math.pow(accY, 2))).toFixed(2);
        let deg = (rotation * 180 / Math.PI).toFixed(0);

        speed.text = 'speed  : ' + ms + ' m/s';
        angle.text = 'angle   : ' + deg + ' deg';

        if (ms > 2) {
            speed.color = 'red';
        } else {
            speed.color = 'green';
        }
        if (deg < 5 || deg > 355) {
            angle.color = 'green';
        } else {
            angle.color = 'red';
        }

        speed.pos = { x: graphics.width - 250, y: 60 };
        angle.pos = { x: graphics.width - 250, y: 90 };

        speed.font = "30px Arial";
        angle.font = "30px Arial";


        graphics.drawText(speed);
        graphics.drawText(angle);
    }

    // manage rotations
    that.rotateRight = function (elapsedTime) {
        if (!that.landed) {
            rotation += (elapsedTime / 500);
        }
    }
    that.rotateLeft = function (elapsedTime) {
        if (!that.landed) {
            rotation -= (elapsedTime / 500);
        }
    }

    // manage thrust.
    that.thrust = function (elapsedTime) {
        if (!that.landed) {
            thrustOK = true;
            accY -= (elapsedTime / 1000) * Math.cos(rotation);
            accX += (elapsedTime / 1000) * Math.sin(rotation);
            that.score = 0;
            particleSystem.addParticles({
                x: center.x - (size.x / 2) * (Math.sin(rotation)),
                y: center.y + (size.y / 2) * Math.cos(rotation),
                rot: rotation
            });
        }
    }


    that.update = function (elapsedTime) {
        if (!that.landed) {
            if ((accY != 0.05 || accX != 0)) { thrustOK = true; }
            if (rotation < 0) {
                rotation += 2 * Math.PI;
            } else if (rotation > 2 * Math.PI) {
                rotation -= 2 * Math.PI;
            }
            center = { x: center.x + accX, y: center.y + accY, radius: size.y / 2 };
        } else {
            thrustOK = false;;
        }
        particleSystem.update(elapsedTime);
        particleSystemSmoke.update(elapsedTime);
    }

    that.render = function () {
        if (this.landed && !this.safe) {
            // crashed
        } else {
            if (isReady) {
                graphics.drawTexture(playerIm, center, rotation, size);
            }
        }

        particleSystemSmoke.render();
        particleSystem.render();

        drawStatus();
    }

    return that;
}