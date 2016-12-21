var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');
var pug = require('pug');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();

var sourceFiles = '/source/template/pages';

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'build')));
app.set('views', __dirname + sourceFiles);
app.set('view engine', 'pug');

app.get(['/', '/index.html'], function(req, res) {
	res.render('index.pug');
});

app.get('/:name.html', function(req,res){
	res.render(req.params.name + '.pug');
});

app.post('/send',function(req,res){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: '',
			pass: ''
		}
	});

	var mailOptions = {
		from: '',
		to: '',
		subject: '',
		text: req.body.name+' '+req.body.email+' '+req.body.message
	 }

	console.log(mailOptions);

	 transporter.sendMail(mailOptions, function (error, info) {
	 	if (error) {
	 		console.log(error);
	 		res.redirect('/works.html');
	 	} else {
	 		console.log('Message Send: ' + info.response);
	 		res.redirect('/works.html');
	 	}
	 })
});

app.use(function(req, res, next) {
  res.status(404);
  res.render('error.pug');
});

app.listen(6060);
console.log('Приложение запущено!');