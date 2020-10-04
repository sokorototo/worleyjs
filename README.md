# Worley Noise Generator.

##### A simple to use Worley noise generator written fully in JavaScript. The module is both embeddable and customizable. The module works both in the browser,  web workers and node. The module can be instanced via CommonJS, AMD or `script` tags.  Module written and implemented with ES6 promises in mind.  This module has **ZER0** dependencies whatsoever.

### Quick Links.

- [Installation](https://github.com/sokorototo/worley-noise#installation)
  - [NPM.](https://github.com/sokorototo/worley-noise#npm)
  - [Embedded.](https://github.com/sokorototo/worley-noise#embedded)
  - [Validation.](https://github.com/sokorototo/worley-noise#validate-installation)
- [Usage](https://github.com/sokorototo/worley-noise#usage)
  - [Basic.](https://github.com/sokorototo/worley-noise#basic)
  - [Advanced.](https://github.com/sokorototo/worley-noise#advanced)
- [Future Updates.](https://github.com/sokorototo/worley-noise#future-updates)
- [Extras.](https://github.com/sokorototo/worley-noise#extras)

### **Installation**

##### NPM.

​	To install with NPM run:

```
npm install worleyjs
```

##### Embedded.

Include the file `worley.min.js`in your project directory. Then:

- Browser :  

  ```html
  <script src="path/to/worley.min.js">
  ```

- Node: 

  ```javascript
  const Worley = require("./path/to/worley.min.js")
  ```

##### Validate installation.

To validate installation. Run:

```bash
npm run test
```



## **Usage**

The module exposes a `Worley`  class. The `Worley` instance contains all the methods and properties needed for the generation of Worley noise.

##### Basic.

- The `crests` property defines how many `"hills"` there are in the texture. 
- The `threshold` argument the distance a pixels should consider to a nearby crest. 
  - <img src="https://github.com/sokorototo/worley-noise/blob/master/media/moving.gif?raw=true" style="zoom: 20%;" />  # Threshold as it changes from 120 to 30
- The `seed` argument is an array of 4 numbers which seed the Texture.

```javascript
let noise = new Worley({
    width: 256, // In pixels
    height: 256, // In pixels
    threshold: 120,
    crests: 15,
    seed: [12345, 45678, 67890, 12345]
});

// Full texture access
let Data;
noise.Texture.ImageData().then((imgData) => {
    // Do something ctx.putImageData(imgData)
    
    console.log(imgData); // Uint8Array => [0,1,2....n]
})
```

That produces the following texture.

​	<img src="https://github.com/sokorototo/worley-noise/blob/master/media/monochrome.png?raw=true" style="zoom: 80%;" /> # A basic 256x256 monochrome Worley noise texture.



#### Advanced.

- **Colour:** To add colour to the texture simply pass a `color`parameter with an array containing colour data for the first and second colour.

  ```javascript
  // RGB
  { color: [[4, 131, 228], [4, 228, 49]]}
  ```

  <img src="https://github.com/sokorototo/worley-noise/blob/master/media/colors.png?raw=true" style="zoom: 80%;" /> # Custom Colours.

- **Transparency:** To include the transparency to your texture .

  ```javascript
  // Transparency
  { alpha: true}
  ```

  <img src="https://github.com/sokorototo/worley-noise/blob/master/media/alpha.png?raw=true" style="zoom:80%;" /> # Alpha On.

- **Interpolation:** You can *"turn off"* interpolation for a little **(mostly insignificant)** speed boost. This doesn't actually turn off interpolation but rather uses bilinear interpolation ( simple distance from a point ) to calculate values. 😁. It also disables custom interpolation functions.

  ```javascript
  // Toggle interpolation
  { interpolate: false }
  ```

  <img src="https://github.com/sokorototo/worley-noise/blob/master/media/interpolation_off.png?raw=true" style="zoom:80%;" /> # Interpolation Off, Compare with above texture.

- **Custom Interpolation Functions:**  To pass a custom interpolation function, simply pass a compatible function to the `interpolant` property in the config object of the noise instance. The `interpolate`  property needs to be set to true for this to work. The `interpolant` function takes three numbers. A lower value, an upper value and a *slider* value( which ranges from 1 to 0 ). With this function crazy effects can be achieved like belts, spots and cat fur patterns. *Expected* behaviour is that the slider defines a point on an interpolation curve, thus the closer the slider is to `0` the closer it is to the lower end of the graph, what the function does is simply **define the shape of the curve**. This is *expected* behaviour, you can obviously do whatever you want in the interpolant value, as long as it abides to the following rules:

  - Always returns a number.
  - Returned values are always clamped between the lower and upper values.

  ```javascript
  {
      interpolant: function(lower, upper, slider){
          // Simple cut-off interpolant
          if( slider >= 0.2 ){
              return upper
          } else {
              return lower
          }
      }
  }
  ```

  ![](https://github.com/sokorototo/worley-noise/blob/master/media/custom_interpolant.png?raw=true) # A simple cut-off interpolant function.

- **Value Of A Given Pixel:** To get the value of a single pixel. Given the x and y co-ordinates:

  ```javascript
  // noise.pixel(x: in pixels, y: in pixels, ?interpolate, ?hierachy: which crest to consider first) 
  // returns a promise which resolves to a number between 0 and 255
  noise.pixel(50, 50, true, 2).then((value) => {
      // Do something
      
      console.log(value);
  })
  ```

- **Raw Data:** To access the raw noise values and not the RGBA texture.

  ```javascript
  // Raw single channel noise data. Stored as a Uint8Array
  noise.Texture.generate().then((raw) => {
      // Do something with the data
      
      console.log(raw);// Uint8Array[100,24, 53,24....n]
  })
  ```

- **Nearby Crest**: If you want to find the closest "crest" given a set of co-ordinates.

  ```javascript
  // X, Y, ?hierachy
  noise.nearestCrest(x, y, 0).then((crest) => {
      // Outputs an array containing 2d co-ordinates in pixels
      console.log(crest); // -> [45, 56]
  })
  ```



### Future Updates.

- [x] Custom colour support.
- [x] NodeJS friendly.
- [x] Custom interpolation functions.
- [ ] WebGPU compute support for Parallel execution.
- [ ] 3D slicing
- [ ] Variable Transparency.
- [ ] Per Crest unique influence.
- [ ] Caching and Seed sorting bug fixes.



----

### Extras.

- Repo is fully open for branching.
- Feedback would be much appreciated.
- Bug reports and fixes.
- All code is fully  accessible and is FREE for all use.
