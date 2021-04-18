"use strict";

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
            if (this.threshold == undefined) {
                this.threshold = Worley.predictThreshold(setup.width, setup.height, setup.crests);
            };
            this.hierachy = setup.hierachy;
            this.metric = setup.metric;
            this.interpolate = setup.interpolate;
            this.interpolant = setup.interpolant;
    
            //Color parameters
            this.colors = setup.colors;
            this.alpha = setup.alpha? setup.alpha + 0.00001: false;
    
            //Seed parameters
            while(setup.seed.length < 4) setup.seed.push(Math.floor(10 * Math.random() * (Math.random() * 2456665234)));
            this.seed = setup.seed.sort();
    
            //This Texture object property abstracts texture manipulation
            this.Texture = {
                parent: this,
                async generate(){
                    let data = new Uint8ClampedArray(this.parent.width * this.parent.height);
                    for(let x = 0; x <= this.parent.width; x ++){
                        for(let y = 0; y <= this.parent.height; y++){
                            data[y * this.parent.width + x] = await this.parent.pixel(x, y)
                        }
                    };
                    this.data = data;
                    return data
                },
                data: null,
                async ImageData(colors = this.parent.colors, alpha = this.parent.alpha, regenerate = false){
                    if (!this.data || regenerate) await this.generate();
                    let imgData;
                    if(!(typeof window !== "undefined" && typeof window.ImageData === "function")){
                        // NodeJS environment
                        imgData = {
                            [Symbol.toStringTag]: "ImageData",
                            width: this.parent.width,
                            height: this.parent.height,
                            data: new Uint8ClampedArray(this.parent.width * this.parent.height * 4)
                        };
                    } else {
                        imgData = new ImageData(this.parent.width, this.parent.height)
                    };
                    
                    for(let i = 0; i < imgData.data.length; i++){
                            let scale = this.data[Math.floor(i / 4)] / 255;
                            //Alpha
                            if((i + 1) % 4 ==0){
                                // Number(false) returns 0
                                imgData.data[i] = 255 - (scale * 255 * Number(alpha));
                                continue;
                            };

                            //Monochrome
                            if(!colors) {
                                imgData.data[i] = this.data[Math.floor(i / 4)];
                                continue;
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
        };
    
        addCrest(x, y, relative){
            if (x == undefined || y == undefined) {
                throw new Error("Cannot add crest without given coordiantres.")
            };
            relative? this.crests.push([Math.round(x * this.width), Math.round(y * this.height)]): this.crests.push([x, y]);
        };
        async nearestCrest(x = 0, y = 0, hierachy = 0){
            if(this.crests.length === 0) return [Infinity, Infinity];
    
            // Manual forloops are faster than higher order functions but array.sort is always an exception
            let crests = this.crests.slice(0);
            for (let i = 0; i < crests.length; i++) {
                let crest = crests[i];
                crests[i] = {crest, distance: Worley.magnitude([x - crest[0], y - crest[1]])}
            };

            return Worley.find(crests, hierachy).crest;
        };
        async pixel(x, y, interpolate = this.interpolate, hierachy = this.hierachy){
            x++;
            let nearestCrest = await this.nearestCrest(x, y, hierachy);
            let distance = Worley.magnitude([x - nearestCrest[0], y - nearestCrest[1]], this.metric);
            return (interpolate)?
                this.interpolant(0, 255, Worley.clamp(distance / this.threshold, 0, 1)): //ERRORS HERE?
                255 * Worley.clamp(distance / this.threshold, 0, 1)
        };
    
        // "Global" module methods
        static clamp(val, min, max){
            if(val > max){
                return max
            } else if (min > val){
                return min
            } else {
                return val
            }
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
        static magnitude(vector, metric = {type: "minkowski", p: 2}){
            switch (metric.type){
                case "euclidean":
                    return Math.sqrt((vector[0]**2 + vector[1]**2));
                case "manhattan":
                    return Math.abs(vector[0]) + Math.abs(vector[1]);
                case "minkowski":
                    return Math.pow((vector[0]**metric.p + vector[1]**metric.p), 1 / metric.p);
                default:
                    return Math.sqrt((vector[0]**2 + vector[1]**2));
            }
        };
        static predictThreshold(width, height, nodes){
            return Math.sqrt((width * height) / (4 * nodes))
        };
        static default(){
            return {
                width: 100,
                height: 100,
                crests: 20,
                hierachy: 0,
                interpolate: true,
                interpolant: Worley.interpolate,
                colors: false,
                alpha: false,
                seed: [
                    Math.floor(Math.random() * (Math.random() * 2456665234)) * 10,
                    Math.floor(Math.random() * (Math.random() * 6242145234)) * 10,
                    Math.floor(Math.random() * (Math.random() * 9253524321)) * 10,
                    Math.floor(Math.random() * (Math.random() * 4364645634)) * 10
                ],
                prerun: 5,
                metric: {type: "euclidean"}
            }
        };
        static rand (a, b, c, d) {
            //Pseudo-Random "Seedable" Number Generator: SCF32 Algorithm used
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
        static find(array, index){
            index++;
            if (index > array.length) index = array.length;
            for (let i = 0; i < index; i++) {
                for (let j = 0; j < (array.length - 1); j++) if (array[j].distance < array[j + 1].distance) [array[j], array[j + 1]] = [array[j + 1], array[j]];
            };
            return array[array.length - index]
        };
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