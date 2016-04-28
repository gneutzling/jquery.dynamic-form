var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var port = process.env.PORT || 8080;

app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes definition.
app.get('/', function (req, res) {
  res.render('index');
});

app.post('/api/contact', function (req, res) {
  fs.writeFile('data.json', JSON.stringify(req.body), 'utf-8');
  res.send('feedback here...');
});

// Start the server.
app.listen(port);
console.log('Server started at http://localhost:' + port);
