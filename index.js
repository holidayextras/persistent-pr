var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.post('/hook', function (req, res) {
  console.log(req.body);
  res.end();
});

app.listen(4646, function () {
  console.log('Example app listening on port 4646!');
});
