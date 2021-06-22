export default [
    {
        input: './src/worley.max.mjs',
        output: {
            file: './build/worley.min.js',
            name: "Worley",
            format: 'umd'
        }
    },
    {
        input: './src/worley.max.mjs',
        output: {
            file: './build/worley.min.mjs',
            format: 'es'
        }
    }
];