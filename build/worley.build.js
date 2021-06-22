export default [
    {
        input: './build/worley.max.mjs',
        output: {
            file: './build/worley.min.js',
            name: "Worley",
            format: 'umd'
        }
    },
    {
        input: './build/worley.max.mjs',
        output: {
            file: './build/worley.min.mjs',
            format: 'es'
        }
    }
];