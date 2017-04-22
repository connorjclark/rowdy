# rowdy (╯°□°）╯︵ ┻━┻

Shows a nice table of your routes in Express.

![](example.png)

## Usage

```
var express = require('express');
var rowdy = require('rowdy-logger');

var app = express();
rowdy.begin(app);

// ... apply your routes ...

var server = app.listen(process.env.PORT || 3000, function() {
    rowdy.print();
});
```
