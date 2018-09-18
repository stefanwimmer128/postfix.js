# postfix.js

Complex features made easy

``` bash
$ yarn add [-D] postfix.js
# or
$ npm i -D postfix.js
```

## ES6 import

``` js
import postfix, {
    stackify,
} from "postfix.js";
```

## CommonJS require

``` js
var postfix = require("postfix.js").default;
    stackify = require("postfix.js").stackify;
```

## UMD bundle

`dist/core.js` and `dist/core.min.js` are UMD bundles.

``` js
/* Using AMD require */
require([
    "https://unpkg.com/postfix.js",
], function (postfix) {
    // postfix
    // postfix.stackify
});
```

``` html
<!-- Using html <script>-tag -->
<script src="https://unpkg.com/postfix.js"></script>
```

# Usage

``` js
postfix("60 5 7 5 - * /"); // [ 6 ]
postfix("60 5 / 7 5 - *"); // [ 24 ]

postfix("1 2 x -", {
    "x": stack => stack.reverse(),
}); // [ 1 ]

postfix("-1 abs", {
    "abs": stackify(Math.abs),
}); // [ 1 ]
```

Nativly supported operations: `+`, `-`, `*`, `/`, `%` and `^` (`Math.pow`)
