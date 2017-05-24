# rowdy (╯°□°）╯︵ ┻━┻

Shows a nice table of your routes in Express.

Supported for Express v. 3, 4, and 5

![](example.png)

## Installation

`npm install --save rowdy-logger`

## Usage

```
var express = require('express');
var rowdy = require('rowdy-logger');

var app = express();
var rowdyResults = rowdy.begin(app)

// ... apply your routes ...

var server = app.listen(process.env.PORT || 3000, function() {
    rowdyResults.print();
});
```
