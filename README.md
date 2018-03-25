# rowdy (╯°□°）╯︵ ┻━┻

Render a nice table of your Express routes

Supports Express v. 3, 4, and 5

![](example.png)

## Installation

```sh
npm install --save rowdy-logger
```

## Usage

```javascript
var express = require('express');
var rowdy = require('rowdy-logger');

var app = express();
var rowdyResults = rowdy.begin(app)

// ... apply your routes ...

var server = app.listen(process.env.PORT || 3000, function() {
    rowdyResults.print();
});
```
