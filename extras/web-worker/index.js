let canvas = document.getElementById("canvas")
, ctx = canvas.getContext("2d")
, options = {
    width: 256,
    height: 256,
    seed: [12345, 45678, 67890, 242521],
    colors: [[255, 134, 65], [123, 35, 100]]
}
, worker = new Worker("worker.js", {name: "worley_gen"})
, button = document.getElementById("trigger")
, inputs = Array.from(document.querySelectorAll("div.control > input"));
button.onclick = () => {
    let setup = {};
    inputs.forEach(input => setup[input.name] = Number(input.value));
    setup = Object.assign(options, setup);
    worker.postMessage(setup);
};

worker.onmessage = (evt) => {
    let img = evt.data.data;
    let data = new ImageData(img, evt.data.width, evt.data.height);
    ctx.putImageData(data, 0, 0);
};