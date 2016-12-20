var express = require('express');
var path = require('path');
var http = require('http');
var pug = require('pug');
var app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.set('views', __dirname + '/source/template/pages');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
	res.render('source/template/pages/index');
});

app.use(function(req, res, next) {
  res.status(404);
  res.render('error.pug');
});


app.listen(8080);
console.log('Приложение запущено! Смотрите на http://localhost:8080');