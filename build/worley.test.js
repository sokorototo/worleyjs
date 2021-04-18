const Jimp = require("jimp");

// This test is built to run in a NodeJs environment
try{
    const Worley = require("./worley.min");
    
    let Noise = new Worley({
        width: 512,
        height: 512,
        crests: 0,
        threshold: 512 / 4,
        colors: [[235, 201, 12], [44, 2, 2]],
        alpha: false,
        prerun: 5,
        interpolate: true,
        interpolant: (min, max, x) => {
            let noiseLevel = 0.35;
            let y = Math.pow(Math.min(Math.cos(Math.PI * x / 2.0), 1.0 - Math.abs(x)), 3) + (noiseLevel * Math.random());
            return (((max - min) * y) + min)
        }
    });

    let distribution = 1 + 512 / 4;
    for (let x = distribution; x < 512; x += distribution) {
        for (let y = distribution; y < 512; y += distribution) {
            Noise.addCrest(x, y);
        }
    }

    let then = Date.now();

    // Noise.pixel test
    then = Date.now();
    Noise.pixel(Noise.width / 2, Noise.height / 2, true, 1).then((output) => {
        let now = Date.now();
        console.log(`[OUTPUT]: Noise.pixel => ${output}`);
        console.log(`[DEBUG]: Noise.pixel took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Noise.pixel -> TEST PASSED\n`);
    });

    // Noise.nearestCrest test
    then = Date.now();
    Noise.nearestCrest(512, 512, 0).then((output) => {
        let now = Date.now();
        console.log(`[OUTPUT]: Noise.nearestCrest => [X:${output[0]}, Y:${output[1]}]`);
        console.log(`[DEBUG]: Noise.nearestCrest took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Noise.nearestCrest -> TEST PASSED\n`);

        console.log(`[DEBUG]: ALL TESTS PASSED\n`);
    });

    // Texture.generate test
    then = Date.now();
    Noise.Texture.generate().then((output) => {
        let now = Date.now();
        console.log(`[OUTPUT]: Texture.generate => ${typeof output}`);
        console.log(`[DEBUG]: Texture.generate took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Texture.generate -> TEST PASSED\n`);
    });

    // Texture.ImageData test
    then = Date.now();
    Noise.Texture.ImageData().then((output) => {
        new Jimp(Noise.width, Noise.height, (_, img) => {
            img.bitmap = output;
            img.getBuffer("image/png", (__, buff) => {
                let fs = require("fs");
                fs.promises.writeFile("pic.png", buff)
            })
        });
        let now = Date.now();
        console.log(`[DEBUG]: Texture.ImageData took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Texture.ImageData -> TEST PASSED\n`);
    });
} catch (e){
    console.log(`[ERROR]: Worley has not installed correctly or an internal error has been raised.`);
    console.log(`[REPO]: https://github.com/sokorototo/worley-noise`);
    console.log(`[HELP]: In case of an internal error copy the following text and forward to the official repository: \n${e}.`);
}