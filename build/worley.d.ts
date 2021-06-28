type Vector = number[];
type distanceMetric = { type: "manhattan" | "euclidean" | "minkowski", p: number };
type WorleyOptions = {
	width: number;
	height: number;
	crests: number;

	hierachy?: number;
	interpolate?: boolean;
	interpolant?: typeof Worley.interpolate;
	colors?: boolean;
	alpha?: boolean;
	seed?: number[];
	prerun?: number;
	metric?: {
		 type: distanceMetric;
		 p?: number
	};
};

export default Worley;
declare class Worley {
	 static clamp(val: number, min: number, max: number): number;
	 static interpolate(min: number, max: number, slider?: number, hierachy?: number): number;
	 static generateCrests(setup: {
		  crests: number;
		  seed: number[];
		  prerun: number;
	 }, noise: Worley): void;
	 static magnitude(vector: Vector, metric?: distanceMetric): number;
	 static predictThreshold(width: number, height: number, nodes: number): number;
	 static default(): WorleyOptions;
	 static rand(a: number, b: number, c: number, d: number): () => number;
	 static find(array: {crest: Vector, distance: number}, index: number): {crest: Vector, distance: number};

	 constructor(setup?: WorleyOptions);
	 width: number;
	 height: number;
	 crests: Vector[];
	 threshold: number;
	 hierachy: number;
	 metric: distanceMetric;
	 interpolate: boolean;
	 interpolant: typeof Worley.interpolate;
	 colors: [number[], number[]];
	 alpha: boolean;
	 Texture: {
		  data: Uint8ClampedArray;
		  parent: Worley;
		  generate(): Promise<Uint8ClampedArray>;
		  ImageData(colors?: [number[], number[]], alpha?: boolean, regenerate?: boolean): Promise<ImageData | {
				[Symbol.toStringTag]: string;
				width: number;
				height: number;
				data: Uint8ClampedArray;
		  }>;
	 };
	 addCrest(x: number, y: number, relative?: boolean): void;
	 nearestCrest(x: number, y: number, hierachy?: number): Promise<Vector>;
	 pixel(x: number, y: number, interpolate?: boolean, hierachy?: number): Promise<number>;
}