# Worley Noise Generator

##### A simple to use Worley noise generator written fully in JavaScript. The module is both embeddable and customizable. The module works both in the browser and node. The module can be instanced via CommonJS, AMD and `script` tags.  Module written and implemented with asynchronous execution in mind. 

### Quick Links.

- [Installation](https://github.com/sokorototo/worley-noise#installation)
  - [NPM.](https://github.com/sokorototo/worley-noise#npm)
  - [Embedded.](https://github.com/sokorototo/worley-noise#affirm-installation#embedded)
  - [Validation.](https://github.com/sokorototo/worley-noise#validation)
- [Usage](https://github.com/sokorototo/worley-noise#usage)
  - [Basic.](https://github.com/sokorototo/worley-noise#basic)
  - [Advanced.](https://github.com/sokorototo/worley-noise#advanced)
- [Future Updates.](https://github.com/sokorototo/worley-noise#future-updates)
- [Extras.](https://github.com/sokorototo/worley-noise#extras)

### **Installation**

##### NPM.

​	To install with NPM simply run: 

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

##### Basic

- The `crests` property defines how many `"hills"` there are in the texture. 
- The `threshold` argument the distance a pixels should consider to a nearby crest. 
  - <img src="https://github.com/sokorototo/worley-noise/blob/master/media/moving.gif?raw=true" style="zoom: 50%;" />  # Threshold as it changes from 120 to 30
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

​	<img src="https://github.com/sokorototo/worley-noise/blob/master/media/monochrome.png?raw=true" style="zoom: 80%;" /> # A basic 256x256 worley noise texture.

#### Advanced.

- **Colour:** To add colour to the texture simply pass a `color`parameter with an array containing colour data for the first and second colour.

  ```javascript
  // RGB
  { color: [[4, 131, 228], [4, 228, 49]]}
  ```

  <img src="https://github.com/sokorototo/worley-noise/blob/master/media/colors.png?raw=true" style="zoom: 200%;" /> # Custom Colors

- **Transparency:** To include the transparency to your texture .

  ```javascript
  // Transparency
  { alpha: true}
  ```

  <img src="https://github.com/sokorototo/worley-noise/blob/master/media/alpha.png?raw=true" style="zoom:80%;" /> # Alpha On

- **Interpolation:** You can turn off interpolation for a little **(mostly insignificant)** speed boost.

  ```javascript
  // Toggle interpolation
  { interpolate: false }
  ```

  <img src="https://github.com/sokorototo/worley-noise/blob/master/media/interpolation_off.png?raw=true" style="zoom:80%;" /> # Interpolation Off

- **Pixel:** To get the value of a single pixel. Given the x and y co-ordinates.

  ```javascript
  // Value of a pixel
  // noise.pixel(x: in pixels, y: in pixels, ?interpolate, ?hierachy: which crest to consider first) 
  // returns a promise which resolves to a number between 0 and 255
  noise.pixel(50, 50, true, 2).then((value) => {
      // Do something
      
      console.log(value);
  })
  ```

- **Raw Data:** To access the raw values of the noise and not the RGBA texture.

  ```javascript
  // Raw single channel data. Stored as a Uint8Array
  noise.Texture.generate().then((raw) => {
      // Do something
      
      console.log(raw);// Uint8Array[100,24, 53,24....n]
  })
  ```

- **Nearby Crest**: If you want to find the closest crests given a set of co-ordinates.

  ```javascript
  // X, Y, ?hierachy
  noise.nearestCrest(x, y, 0).then((crest) => {
      // Outputs an array containing pixel co-ordinates
      console.log(crest); // -> [45, 56]
  })
  ```



### Future Updates.

- [x] Custom colour support.
- [x] NodeJS friendly.
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