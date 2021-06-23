import Worley from '../build/worley.min.mjs';

let canvas = document.getElementById("canvas")
, ctx = canvas.getContext("2d")
, options = {
    width: 256,
    height: 256,
    colors: [[255, 134, 65], [123, 35, 100]],
    interpolate: false,
    threshold: 8
}
, button = document.getElementById("trigger")
, inputs = Array.from(document.querySelectorAll("div.control > input"));
button.onclick = () => {
    let setup = {};
    inputs.forEach(input => setup[input.name] = Number(input.value));
    setup = Object.assign(options, setup);
    let noise = new Worley(setup);
    noise.Texture.ImageData().then((img) => {
        console.log(`[IMG]: ${img}`);
        ctx.putImageData(img, 0, 0);
    }).catch(e => console.log(`%c [ERROR]: ${e.message}`, "color: red; font-family: monospace"));
};
