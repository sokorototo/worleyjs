importScripts("../lib/worley.min.js");
addEventListener("message", (evt) => {
    let noise = new Worley(evt.data);
    noise.Texture.ImageData().then(postMessage);
});