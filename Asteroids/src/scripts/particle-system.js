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
            let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
            let p = create({
                image: spec.image,
                center: { x: ctr.x, y: ctr.y },
                size: { x: size, y: size },
                rotation: 0,
                speed: Math.abs(Random.nextGaussian(spec.speed.mean, spec.speed.stdev)),
                direction: Random.nextCircleVector(ctr.rot),
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
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
        for (let particle = 0; particle < 500; particle++) {
            let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
            let p = create({
                image: spec.image,
                center: { x: ctr.x, y: ctr.y },
                size: { x: size, y: size },
                rotation: 0,
                speed: Math.abs(Random.nextGaussian(spec.speed.mean + .1, spec.speed.stdev)),
                direction: Random.nextCircleVector(),
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
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
