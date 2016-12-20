var express = require('express');
var path = require('path');
var http = require('http');
var pug = require('pug');
var app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.set('views', __dirname + '/source/template/pages');
app.set('view engine', 'pug');

app.get(['/', '/index*'], function(req, res) {
	res.render('index.pug');
});

app.get('/works*', function(req, res) {
	res.render('works.pug');
});

app.get('/about*', function(req, res) {
	res.render('about.pug');
});

app.get('/blog*', function(req, res) {
	res.render('blog.pug');
});

app.use(function(req, res, next) {
  res.status(404);
  res.render('error.pug');
});


app.listen(6060);
console.log('Приложение запущено!');