var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');
var pug = require('pug');
var nodemailer = require("nodemailer");

var app = express();

var sourceFiles = '/source/template/pages';

app.use(express.static(path.join(__dirname, 'build')));
app.set('views', __dirname + sourceFiles);
app.set('view engine', 'pug');

app.get(['/', '/index.html'], function(req, res) {
	res.render('index.pug');
});

app.get('/:name.html', function(req,res){
	res.render(req.params.name + '.pug');
});

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "166507@gmail.com",
        pass: "Re9ziner"
    }
});

app.get('/send',function(req,res){
    var mailOptions={
        from : req.query.from,
        email : req.query.email,
        message : req.query.message
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
		});
});

app.use(function(req, res, next) {
  res.status(404);
  res.render('error.pug');
});


app.listen(6060);
console.log('Приложение запущено!');