const { Scanner, Token } = require("./scanner.js");

class Parser {
    scanner;
    currentToken;

    constructor(scanner) {
        this.scanner = scanner;
        this.nextToken();
    }

    parse() {
        const ast = {
            type: "Program",
            body: [],
        };

        while (this.currentToken.type !== Token.EOF) {
            if (
                this.currentToken.type === Token.Keyword &&
                this.currentToken.value === "var"
            )
                ast.body.push(this.variableDeclaration());
            else if (
                this.currentToken.type === Token.Keyword &&
                this.currentToken.value === "print"
            )
                ast.body.push(this.printStatement());
            else ast.body.push(this.expressionStatement());
        }

        return ast;
    }

    nextToken() {
        this.currentToken = this.scanner.lex();
        return this.currentToken;
    }

    expressionStatement() {
        const expression = this.assignmentExpression();
        return {
            type: "ExpressionStatement",
            expression,
        };
    }

    assignmentExpression() {
        const left = this.expression();

        if (left.type == "Identifier" && this.currentToken.value == "=") {
            const operator = this.currentToken.value;
            this.nextToken();
            const right = this.expression();
            return {
                type: "AssignmentExpression",
                operator,
                left,
                right,
            };
        } else return left;
    }

    expression() {
        const left = this.term();

        while (
            this.currentToken.type === Token.Punctuator &&
            ["+", "-"].includes(this.currentToken.value)
        ) {
            const operator = this.currentToken.value;
            this.nextToken();
            const right = this.term();
            return {
                type: "BinaryExpression",
                operator,
                left,
                right,
            };
        }

        return left;
    }

    term() {
        const left = this.factor();

        while (
            this.currentToken.type === Token.Punctuator &&
            ["*", "/"].includes(this.currentToken.value)
        ) {
            const operator = this.currentToken.value;
            this.nextToken();
            const right = this.factor();
            return {
                type: "BinaryExpression",
                operator,
                left,
                right,
            };
        }

        return left;
    }

    factor() {
        const token = this.currentToken;
        this.nextToken();

        if (token.type == Token.Punctuator && token.value === "-") {
            return {
                type: "UnaryExpression",
                operator: "-",
                argument: this.factor(),
            };
        } else if (token.type === Token.Number)
            return {
                type: "Literal",
                value: token.value,
            };
        else if (token.type === Token.Identifier)
            return {
                type: "Identifier",
                name: token.value,
            };
    }

    variableDeclaration() {
        this.nextToken();
        const token = this.term();

        let init;
        if (token.type === Token.Identifier) {
            if (
                this.currentToken.type === Token.Punctuator &&
                this.currentToken.value === "="
            ) {
                this.nextToken();
                init = this.expression();
            }
        } else this.scanner.handleUnexpectedToken("Expected identifier");

        return {
            type: "VariableDeclaration",
            id: token,
            init,
        };
    }

    printStatement() {
        this.nextToken();
        let expressions = [];

        expressions.push(this.expression());

        while (
            this.currentToken.type === Token.Punctuator &&
            this.currentToken.value === ","
        ) {
            this.nextToken();
            expressions.push(this.expression());
        }

        return {
            type: "PrintStatement",
            expressions,
        };
    }
}

function pretyPrintAST(ast, indent = 0) {
    if (ast == null) return;

    Object.keys(ast).forEach((key) => {
        if (typeof ast[key] === "object") {
            console.log(" ".repeat(indent * 2), key, ":");
            pretyPrintAST(ast[key], indent + 2);
        } else {
            console.log(
                " ".repeat(indent * 2),
                key,
                ":",
                typeof ast[key] === "string" ? `"${ast[key]}"` : ast[key]
            );
        }
    });
}

module.exports = { Parser, pretyPrintAST };
