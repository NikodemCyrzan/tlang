const readline = require("readline");
const { Interpreter } = require("./src/interpreter.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Write 'exit' to exit.");

const interpreter = new Interpreter("");

rl.on("line", (input) => {
    if (input.trim() === "exit") {
        rl.close();
    } else {
        try {
            interpreter.interpretLine(input);
        } catch (error) {
            console.error(error);
        }
    }
});
