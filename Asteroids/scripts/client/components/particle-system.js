'use strict';


function ParticleSystem(graphics, spec) {
    let that = {};
    let particles = [];
    //
    //      Creates particle system given the following attributes:
    //      fill: ,
    //      stroke: ,
    //      center: {x: , y:},
    //      rotation: ,
    //      image: ,
    //      size: {x: , y: },
    //      font: font
    //
    // --------------------------------------------------------------
    function create(spec) {
        let that = {};

        spec.fill = 'rgb(255, 255, 255)';
        spec.stroke = 'rgb(0, 0, 0)';
        spec.alive = 0;

        that.update = function (elapsedTime) {
            spec.center.x += (spec.speed * spec.direction.x * elapsedTime);
            spec.center.y += (spec.speed * spec.direction.y * elapsedTime);
            spec.alive += elapsedTime;
            spec.rotation += spec.speed * 0.5;

            return spec.alive < spec.lifetime;
        };

        that.draw = function () {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        };

        return that;
    }


    //
    //      adds particles to system given the following attributes:
    //      rot: ,
    //      x: ,
    //      y: ,
    //
    // --------------------------------------------------------------
    that.addParticles = function (ctr) {
        for (let particle = 0; particle < 5; particle++) {
            let size = Math.abs(nextGaussian(spec.size.mean, spec.size.stdev));
            let p = create({
                image: spec.image,
                center: { x: ctr.x, y: ctr.y },
                size: { x: size, y: size },
                rotation: 0,
                speed: Math.abs(nextGaussian(spec.speed.mean, spec.speed.stdev)),
                direction: nextCircleVector(1),
                lifetime: nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
            });
            particles.push(p);
        }
    }

    //
    //      creates an explosion given the following attributes:
    //      x: ,
    //      y: ,
    //
    // --------------------------------------------------------------
    that.createExplosion = function (ctr) {
        for (let particle = 0; particle < 5; particle++) {
            let sizet = Math.abs(nextGaussian(spec.size.mean, spec.size.stdev));
            let p = create({
                image: spec.image,
                center: { x: ctr.x, y: ctr.y },
                size: { x: sizet, y: sizet },
                rotation: 0,
                speed: Math.abs(nextGaussian(spec.speed.mean, spec.speed.stdev)),
                direction: nextCircleVector(1),
                lifetime: nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
            });
            particles.push(p);
        }
    }

    that.update = function (elapsedTime) {
        let keepMe = [];
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].update(elapsedTime)) {
                keepMe.push(particles[particle]);
            }
        }
        particles = keepMe;

    };

    that.render = function () {
        for (let p = particles.length - 1; p >= 0; p--) {
            particles[p].draw();
        }
    };

    return that;
}

let usePrevious = false,
    y2 = 0;

// ------------------------------------------------------------------
//
// Generate a uniformly selected vector (x,y) around the circumference of a
// unit circle.
//
// ------------------------------------------------------------------
function nextCircleVector(scale) {
    let angle = Math.random() * 2 * Math.PI;

    return {
        x: Math.cos(angle) * scale,
        y: Math.sin(angle) * scale
    };
}

// ------------------------------------------------------------------
//
// Generate a normally distributed random number.
//
// NOTE: This code is adapted from a wiki reference I found a long time ago.  I originally
// wrote the code in C# and am now converting it over to JavaScript.
//
// ------------------------------------------------------------------
function nextGaussian(mean, stdDev) {
    let x1 = 0,
        x2 = 0,
        y1 = 0,
        z = 0;

    //
    // This is our early out optimization.  Every other time this function is called
    // the number is quickly selected.
    if (usePrevious) {
        usePrevious = false;

        return mean + y2 * stdDev;
    }

    usePrevious = true;

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        z = (x1 * x1) + (x2 * x2);
    } while (z >= 1);

    z = Math.sqrt((-2 * Math.log(z)) / z);
    y1 = x1 * z;
    y2 = x2 * z;

    return mean + y1 * stdDev;
}

