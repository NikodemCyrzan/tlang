const { Parser } = require("./parser");
const { Scanner } = require("./scanner");

class Interpreter {
    variables = new Map();
    code;

    constructor(code) {
        this.code = code;
    }

    interpret() {
        const ast = new Parser(new Scanner(this.code)).parse();

        for (const node of ast.body) {
            if (node.type === "VariableDeclaration") {
                this.variables.set(node.id.name, node.init.value);
            } else if (node.type === "PrintStatement") {
                const value = this.evaluate(node.expression);
                console.log(value);
            } else if (node.type === "ExpressionStatement") {
                this.evaluate(node.expression);
            }
        }
    }

    interpretLine(line) {
        this.code += line;

        const ast = new Parser(new Scanner(line)).parse();

        for (const node of ast.body) {
            if (node.type === "VariableDeclaration") {
                const value = node.init != null ? this.evaluate(node?.init) : 0;
                this.variables.set(node.id.name, value);
                console.log(value);
            } else if (node.type === "PrintStatement") {
                let output = "";
                node.expressions.forEach((expression) => {
                    output += `${this.evaluate(expression)}\t`;
                });
                console.log(output);
            } else if (node.type === "ExpressionStatement") {
                console.log(this.evaluate(node.expression));
            }
        }
    }

    evaluate(node) {
        switch (node.type) {
            case "Identifier":
                return this.variables.get(node.name);
            case "Literal":
                return Number(node.value);
            case "BinaryExpression":
                const left = this.evaluate(node.left);
                const right = this.evaluate(node.right);

                switch (node.operator) {
                    case "+":
                        return Number(left) + Number(right);
                    case "-":
                        return Number(left) - Number(right);
                    case "*":
                        return Number(left) * Number(right);
                    case "/":
                        return Number(left) / Number(right);
                }
            case "AssignmentExpression":
                const value = this.evaluate(node.right);
                this.variables.set(node.left.name, value);
                return Number(value);
            case "UnaryExpression":
                return -this.evaluate(node.argument);
        }
    }
}

module.exports = { Interpreter };
