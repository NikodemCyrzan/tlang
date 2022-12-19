const Character = require("./character");

const Token = {
    Punctuator: "Punctuator",
    Identifier: "Identifier",
    Keyword: "Keyword",
    Number: "Number",
    EOF: "EOF",
};

class Scanner {
    source;

    index = 0;
    lineNumber = 0;
    column = 0;
    lineStart = 0;

    constructor(source) {
        this.source = source.trim();
    }

    eof() {
        return this.index >= this.source.length;
    }

    handleUnexpectedToken(message) {
        return this.errorHandler.throwError(
            message,
            this.index,
            this.lineNumber,
            this.index - this.lineStart + 1
        );
    }

    scanPunctuator() {
        const start = this.index;

        let str = this.source[start];
        switch (str) {
            case "+":
            case "-":
            case "/":
            case "=":
            case ",":
            case "*":
                ++this.index;
                break;
        }

        if (this.index === start) {
            // TODO: handle unexpected token
        }

        return {
            type: Token.Punctuator,
            value: str,
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start,
            end: this.index,
        };
    }

    scanIdentifier() {
        const start = this.index;
        ++this.index;

        while (!this.eof()) {
            const char = this.source[this.index];

            if (Character.isIdentifierPart(char.charCodeAt(0))) ++this.index;
            else break;
        }

        return {
            type: Token.Identifier,
            value: this.source.slice(start, this.index),
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start,
            end: this.index,
        };
    }

    scanNumber() {
        const start = this.index;
        ++this.index;

        while (!this.eof()) {
            const char = this.source[this.index];

            if (Character.isDecimalDigit(char.charCodeAt(0))) ++this.index;
            else break;
        }

        return {
            type: Token.Number,
            value: this.source.slice(start, this.index),
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start,
            end: this.index,
        };
    }

    isKeyword(str) {
        return str === "var" || str === "print";
    }

    isPunctuator(str) {
        return (
            str === "=" ||
            str === "+" ||
            str === "-" ||
            str === "*" ||
            str === "/" ||
            str === ","
        );
    }

    scanKeywordOrIdentifier() {
        const token = this.scanIdentifier();

        if (this.isKeyword(token.value)) token.type = Token.Keyword;

        return token;
    }

    skipLineTerminator() {
        const char = this.source[this.index];

        if (char === "\r") {
            ++this.index;
            if (this.source[this.index] === "\n") ++this.index;
        } else if (char === "\n") ++this.index;
        else return;
        ++this.lineNumber;
        this.lineStart = this.index;
    }

    lex() {
        if (this.eof()) {
            return {
                type: Token.EOF,
                value: "",
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: this.index,
                end: this.index,
            };
        }

        let char = this.source[this.index];

        while (
            Character.isWhiteSpace(char?.charCodeAt(0)) ||
            Character.isLineTerminator(char?.charCodeAt(0))
        ) {
            if (this.eof()) {
                return {
                    type: Token.EOF,
                    value: "",
                    lineNumber: this.lineNumber,
                    lineStart: this.lineStart,
                    start: this.index,
                    end: this.index,
                };
            } else if (Character.isLineTerminator(char?.charCodeAt(0)))
                this.skipLineTerminator();
            else ++this.index;
            char = this.source[this.index];
        }

        if (Character.isIdentifierStart(char?.charCodeAt(0)))
            return this.scanKeywordOrIdentifier();
        else if (Character.isDecimalDigit(char?.charCodeAt(0)))
            return this.scanNumber();
        else if (this.isPunctuator(char)) return this.scanPunctuator();
        else {
            // TODO: handle unexpected token
        }
    }
}

module.exports = {
    Token,
    Scanner,
};
