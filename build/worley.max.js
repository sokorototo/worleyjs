((Global) => {
    class Worley{
        constructor(setup = Worley.default()){
            setup = Object.assign(Worley.default(), setup);
            //Texture parameters
            this.width = setup.width;
            this.height = setup.height;

            //Algorithm parameters
            this.crests = Worley.generateCrests(setup);
            this.threshold = setup.threshold;
            this.hierachy = setup.hierachy;
            this.interpolate = setup.interpolate;
            this.interpolant = setup.interpolant;

            //Color parameters
            this.colors = setup.colors;
            this.alpha = setup.alpha;

            //Seed parameters
            while(setup.seed.length < 4) setup.seed.push(Math.floor(10 * Math.random() * (Math.random() * 2456665234)));
            this.seed = setup.seed.sort();

            //This Texture object property abstracts texture manipulation
            this.Texture = {
                parent: this,
                async generate(callback){
                    let data = new Uint8Array(this.parent.width * this.parent.height);
                    for(let x = 0; x <= this.parent.width; x ++){
                        for(let y = 0; y <= this.parent.height; y++){
                            data[y * this.parent.width + x] = await this.parent.pixel(x, y)
                        }
                    };
                    if(callback !== undefined) callback(data);
                    this.data = data;
                    return data
                },
                data: null,
                async ImageData(colors = this.parent.colors, alpha = this.parent.alpha, regenerate = false){
                    if (!this.data || regenerate) await this.generate();
                    let imgData;
                    if(typeof document === "undefined"){
                        // NodeJS environment
                        imgData = {
                            [Symbol.toStringTag]: "ImageData",
                            width: this.parent.width,
                            height: this.parent.height,
                            data: new Uint8Array(this.parent.width * this.parent.height * 4)
                        };
                    } else {
                        imgData = new ImageData(this.parent.width, this.parent.height)
                    }
                    for(let i = 0; i < imgData.data.length; i++){
                        let scale = this.data[Math.floor(i / 4)] / 255;
                        //Alpha
                        if((i + 1) % 4 ==0){
                            if (this.parent.alpha) {
                                imgData.data[i] = 255 - (scale * 255)
                            } else {
                                imgData.data[i] = 255
                            };
                            continue
                        };

                        //Monochrome
                        if(!colors) {
                            imgData.data[i] = this.data[Math.floor(i / 4)];
                            continue
                        };

                        //RGBA
                        switch((i + 1) % 4){
                            case 1:
                                //Red Channel
                                let minR = colors[0][0], maxR = colors[1][0];
                                imgData.data[i] = minR + ((maxR - minR) * scale);
                                break;
                            case 2:
                                //Green Channel
                                let minG = colors[0][1], maxG = colors[1][1];
                                imgData.data[i] = minG + ((maxG - minG) * scale);
                                break;
                            case 3:
                                //Blue Channel
                                let minB = colors[0][2], maxB = colors[1][2];
                                imgData.data[i] = minB + ((maxB - minB) * scale);
                                break;
                        }
                    };

                    return imgData
                }
            };
        }
        async nearestCrest(x = 0, y = 0, hierachy = 0){
            if(this.crests.length === 0) return [Infinity, Infinity];
            return this.crests.slice(0).map((crest) => {return {crest, distance: Worley.magnitude([x - crest[0], y - crest[1]])}}).sort((a, b) => {return a.distance - b.distance})[hierachy].crest;
        }
        async pixel(x, y, interpolate = this.interpolate, hierachy = this.hierachy){
            let nearestCrest = await this.nearestCrest(x, y, hierachy);
            let distance = Worley.magnitude([x - nearestCrest[0], y - nearestCrest[1]])
            return (interpolate)? this.interpolant(0, 255, Worley.clamp(distance / this.threshold, 0, 1)): 255 * Worley.clamp(distance / this.threshold, 0, 1)
        }

        // "Global" module methods
        static clamp(val, min, max, teleport = false){
            if (val < min) teleport ? val = max : val = min;
            if (val > max) teleport ? val = min : val = max;
            return val
        };
        static interpolate(min, max, x = 0.5){
            x = (Math.sin((Math.PI * x) - (Math.PI / 2)) + 1) / 2;
            return (min + ((max - min) * x))
        }
        static generateCrests(setup = Worley.default()) {
            // Initialize the Random Number Generator
            let rand = Worley.rand(setup.seed[0], setup.seed[1], setup.seed[2], setup.seed[3]);

            for(let i = 0; i <= setup.prerun; i ++) rand();
            // Generate the crests
            let crests = Array.from({length: setup.crests}, () => [Math.round(rand() * setup.width), Math.round(rand() * setup.height)]);
            return crests;
        };
        static magnitude([x, y]){
            return Math.sqrt((x**2 + y**2))
        };  
        static default(){
            return {
                threshold: 55,
                hierachy: 0,
                width: 100,
                height: 100,
                colors: false,
                alpha: false,
                crests: 20,
                interpolate: true,
                interpolant: Worley.interpolate,
                seed: [
                    Math.floor(Math.random() * (Math.random() * 2456665234)) * 10,
                    Math.floor(Math.random() * (Math.random() * 6242145234)) * 10,
                    Math.floor(Math.random() * (Math.random() * 9253524321)) * 10,
                    Math.floor(Math.random() * (Math.random() * 4364645634)) * 10
                ],
                prerun: 10
            }
        };
        static rand (a, b, c, d) {
            //Pseudo-Random "Seedable" Number Generator
            return function() {
                a |= 0; b |= 0; c |= 0; d |= 0; 
                var t = (a + b | 0) + d | 0;
                d = d + 1 | 0;
                a = b ^ b >>> 9;
                b = c + (c << 3) | 0;
                c = c << 21 | c >>> 11;
                c = c + t | 0;
                return (t >>> 0) / 4294967296;
            }
        }
    };

    if (typeof define === 'function' && define.amd) {
        // Asynchronous Module Definition (AMD).
        define(["Worley"], Worley);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        module.exports = Worley
    } else {
        // Otherwise inject the module into the global scope
        Global.Worley = Worley
    }
})(globalThis);