const PNG = require("pngjs").PNG, { createWriteStream } = require("fs");

// This test is built to run in a NodeJs environment
try{
    const Worley = require("../build/worley.min"), size = 512;
    
    let Noise = new Worley({
        width: size,
        height: size,
        crests: 54,
        threshold: size / 4,
        colors: [[235, 201, 12], [44, 2, 2]],
        alpha: false,
        prerun: 5,
        interpolate: true,
        hierachy: 0,
        interpolant: (min, max, x) => {
            let noiseLevel = 0.35;
            let y = Math.pow(Math.min(Math.cos(Math.PI * x / 2.0), 1.0 - Math.abs(x)), 3) + (noiseLevel * Math.random());
            return (((max - min) * y) + min)
        }
    });

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
    Noise.nearestCrest(size, size, 0).then((output) => {
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
        let png = new PNG({
            width: output.width,
            height: output.height,
            inputHasAlpha: true
        });
        png.data = output.data;
        png.pack().pipe(createWriteStream("pic.png"));
        png.on("finish", () => { console.log("[TEST] => All tests passed!") })
    });
} catch (e){
    console.log(`[ERROR]: Worley has not installed correctly or an internal error has been raised.`);
    console.log(`[REPO]: https://github.com/sokorototo/worley-noise`);
    console.log(`[HELP]: In case of an internal error copy the following text and forward to the official repository: \n${e}.`);
}
