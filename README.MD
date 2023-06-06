# TLang (Test Language)

Simple programming language made in order to learn the basics of creating programming languages.

## Features

-   declaring variables with optional initial value
-   creating binary expressions with operators: `+`, `-`, `*`, `/`
-   creating assignment expressions
-   printing values to the console

## Example

```
var x = 3
var y = 2
var z = x * y

print x, y, z
```

## Keywords

`var` - variable declaration

### Syntax:

```
var IDENTIFIER (PUNCTUATOR(=) BINARY_EXPRESSION)?
```

---

`print` - prints values to the console

### Syntax:

```
print EXPRESSION (PUNCTUATOR(,) BINARY_EXPRESSION)*
```

# Implementation

## 1. Lexical Grammar

### 1.1. White Space

White space code points are used for [tokens](#13-tokens) separation and to improve source text readability. They may occur between any two tokens and on the start or end of input.

##### Table 1: White Space Code Points

| Code Points                                    | Name                      | Abbreviation |
| ---------------------------------------------- | ------------------------- | ------------ |
| U+0009                                         | CHARACTER TABULATION      | TAB          |
| U+000B                                         | LINE TABULATION           | VT           |
| U+000C                                         | FORM FEED                 | FF           |
| U+FEFF                                         | ZERO WIDTH NO-BREAK SPACE | ZWNBSP       |
| any code point from "Space_Separator" category |                           | USP          |

### 1.2. Line Terminators

Line Terminator code points are used for [tokens](#13-tokens) separation and to improve source text readability. As [white space](#11-white-space) code points, they may occur between any two tokens and on the start or end of input.

##### Table 2: Line Terminator Code Points

| Code Points | Name                | Abbreviation |
| ----------- | ------------------- | ------------ |
| U+000A      | LINE FEED           | LF           |
| U+000D      | CARRIAGE RETURN     | CR           |
| U+2028      | LINE SEPARATOR      | LS           |
| U+2029      | PARAGRAPH SEPARATOR | PS           |

Only the Unicode code points in [Table 2](#table-2-line-terminator-code-points) are treated as line terminators. Other new line or line breaking Unicode code points are not treated as line terminators but are treated as white space if they meet the requirements listed in Table [Table 1](#table-1-white-space-code-points). The sequence CR+LF is commonly used as a line terminator. It should be considered as single character for the purpose of reporting line numbers.

### 1.3. Tokens

Tokens are the smallest indivisible syntactic units of a language

| Name       | Syntax                           |
| ---------- | -------------------------------- |
| KEYWORD    | (var\|print)                     |
| IDENTIFIER | \[\$\_a-zA-Z\]\[$\_a-zA-Z0-9\]\* |
| NUMBER     | [0-9]                            |
| PUNCTUATOR | (+\|-\|\*\|/\|\*\*\|,)           |

## 2. Expressions

### 2.1. Binary expression

Binary expression consists of two operands and one operator. The operand can be any number or identifier, but it can also be another binary expression.

#### Syntax:

```
(IDENTIFIER|NUMBER|BINARY_EXPRESSION) (PUNCTUATOR(+|-|*|/|**) (IDENTIFIER|NUMBER|BINARY_EXPRESSION))*
```

### 2.2. Assignment expression

Assignment expressions are used to assign [Binary Expression](#21-binary-expression) to the variable.

#### Syntax:

```
IDENTIFIER PUNCTUATOR(=) BINARY_EXPRESSION
```

## 3. Variable declaration

Variable declarations are initated with `var` Keyword and they create new variable in memory, which can be accesed by supplied Identifier. It is also possible to assign initial value to the variable, which is [Binary Expression](#21-binary-expression).

#### Syntax:

```
var IDENTIFIER (PUNCTUATOR(=) BINARY_EXPRESSION)?
```

## 4. Printing to the conosole

Printing to the console allows to see results of computations.

#### Syntax:

```
print (IDENTIFIER|BINARY_EXPRESSION) (PUNCTUATOR(,) (IDENTIFIER|BINARY_EXPRESSION))*
```
