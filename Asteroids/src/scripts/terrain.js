function terrain(graphics, howMany = 2) {
    let that = {}

    let myTerrain = [];

    let difficulty = 10;
    if (howMany == 1) {
        difficulty = 20
    }
    const iter = 5;

    // add begining point
    myTerrain.push({
        x: 0,
        y: Random.nextRange(graphics.height / 3, graphics.height),
        safe: false,
    });

    // add safe zones
    for (let i = 0; i < howMany; i++) {
        let slidingWindowWidth = graphics.width / howMany;
        let ySafe = Random.nextRange(graphics.height / 2, graphics.height - 1);
        let xOneSafe = Random.nextRange(i * slidingWindowWidth + difficulty, slidingWindowWidth * (i + 1) - (slidingWindowWidth * howMany / difficulty) - difficulty)
        myTerrain.push({
            x: xOneSafe,
            y: ySafe,
            safe: true,
        });
        myTerrain.push({
            x: xOneSafe + (slidingWindowWidth * howMany / difficulty),
            y: ySafe,
            safe: false,
        });

    }

    // add end point
    myTerrain.push({
        x: graphics.width,
        y: Random.nextRange(graphics.height / 3, graphics.height),
        safe: false,
    });

    // random terrain generation over iters iterations.
    for (let i = 0; i < iter; i++) {
        let tmpTerrain = [];
        for (let j = 0; j < myTerrain.length - 1; j++) {
            if (myTerrain[j].safe) {
                tmpTerrain.push(myTerrain[j]);
            } else {
                let xMid = Math.floor((myTerrain[j + 1].x - myTerrain[j].x) / 2);
                let yMid = myTerrain[j].y + Math.floor((myTerrain[j + 1].y - myTerrain[j].y) / 2);
                let distance = xMid;
                let randNormalY = Math.abs(Random.nextGaussian(yMid, Math.floor(distance / 2)));
                let counter = 0;
                while (randNormalY + yMid > graphics.height * 2 || randNormalY + yMid < graphics.height / 20) {
                    if (counter > 100) {
                        randNormalY = Random.nextGaussian(yMid, 10);
                        break;
                    };
                    randNormalY = Math.abs(Random.nextGaussian(yMid, Math.floor(distance / 2)));
                    counter++;
                }
                tmpTerrain.push(myTerrain[j]);
                tmpTerrain.push({
                    x: xMid + myTerrain[j].x,
                    y: randNormalY,
                    safe: false
                })
            }
        }
        tmpTerrain.push(myTerrain[myTerrain.length - 1]);
        myTerrain = tmpTerrain;
    }
    let spec = { terrain: myTerrain, bottomBoundry: graphics.height };


    that.render = function () {
        graphics.drawTerrain(spec);
    }

    that.ter = myTerrain;

    return that;
}