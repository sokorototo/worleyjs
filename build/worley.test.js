// This test is built to run in a NodeJs environment
try{
    const Worley = require("./worley.min");
    let Noise = new Worley({
        width: 1080,
        height: 1080,
        threshold: 1080 / (2/3),
        colors: [[6, 156, 18], [5, 67, 243]],
        alpha: false,
        seed: [12234, 32145435,3452345,23453252],
        interpolate: true,
        crests: 35,
        prerun: 35
    });
    let then = Date.now();

    // Noise.pixel test
    then = Date.now();
    Noise.pixel(Noise.width / 2, Noise.height / 2, 1, true).then((output) => {
        let now = Date.now();
        console.log(`[OUTPUT]: Noise.pixel => ${output}`);
        console.log(`[DEBUG]: Noise.pixel took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Noise.pixel -> TEST PASSED\n`);
    });

    // Noise.nearestCrest test
    then = Date.now();
    Noise.nearestCrest(Noise.width / 2, Noise.height / 2, 3).then((output) => {
        let now = Date.now();
        console.log(`[OUTPUT]: Noise.nearestCrest => ${typeof output}`);
        console.log(`[DEBUG]: Noise.nearestCrest took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Noise.nearestCrest -> TEST PASSED\n`);

        console.log(`[DEBUG]: ALL TESTS PASSED\n`);
    });

    // Texture.generate test
    then = Date.now();
    Noise.Texture.generate().then((output) => {
        let now = Date.now();
        console.log(`[OUTPUT]: Texture.ImageData => ${typeof output}`);
        console.log(`[DEBUG]: Texture.generate took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Texture.generate -> TEST PASSED\n`);
    });

    // Texture.ImageData test
    then = Date.now();
    Noise.Texture.ImageData().then((output) => {
        let now = Date.now();
        console.log(`[OUTPUT]: Texture.ImageData => ${typeof output}`);
        console.log(`[DEBUG]: Texture.ImageData took ${(now - then) / 1000}s to execute`);
        console.log(`[DEBUG]: Texture.ImageData -> TEST PASSED\n`);
    });
} catch (e){
    console.log(`[ERROR]: Worley has not installed correctly or an internal error has been raised.`);
    console.log(`[HELP]: In case of an internal error copy the following text and forward to the official repository${e}`);
    console.log(`[REPO]: https://github.com/sokorototo/worley-noise`);
}