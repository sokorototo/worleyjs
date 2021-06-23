import { uglify } from "rollup-plugin-uglify"

export default [
    {
        input: './src/worley.max.mjs',
        output: {
            file: './build/worley.min.js',
            name: "Worley",
            format: 'umd'
        },
        plugins: [ uglify() ]
    },
    {
        input: './src/worley.max.mjs',
        output: {
            file: './build/worley.min.mjs',
            format: 'es'
        },
        plugins: [ uglify() ]
    }
];