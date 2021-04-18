const ansi = require("ansi-colors");
const uglify = require("uglify-js");
const {writeFileSync, readFileSync} = require("fs");

// Message
console.log(`[${ansi.blue.bold("BUILDING")}]`);

// Config
let config = {
    warnings: true,
    ie8: true,
    output: {
        preamble: `/* Plug Softworks, ${new Date().getFullYear()} */`
    }
}

// Disk reading and Compression
try {
    let then = Date.now();
    let maxjs = uglify.minify(readFileSync("build/worley.max.js", { encoding: "utf8" }), config).code;
    let maxmjs = uglify.minify(readFileSync("build/worley.max.mjs", { encoding: "utf8" }), config).code;
    writeFileSync("build/worley.min.js", maxjs);
    writeFileSync("build/worley.min.mjs", maxmjs);

    console.log(`Building took: ${ansi.italic(Date.now() - then)}ms`);
    console.log(`[${ansi.green.bold("BUILD PASSED")}]\n`);
} catch (e){ console.log(`[${ansi.red.bold.underline("BUILD FAILED")}] => ${e.message}`) }