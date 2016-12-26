var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');
var pug = require('pug');
var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var router = express.Router();
var MongoStore = require('connect-mongo')(session);

var app = express();
var sourceFiles = '/source/template/pages';

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost/test');

// user
var user = {
	username: 'user',
	password: 'password',
	id: 1
};

app.use(express.static(path.join(__dirname, 'build')));
app.set('views', __dirname + sourceFiles);
app.set('view engine', 'pug');

app.get(['/', '/index.html'], function(req, res) {
	res.render('index.pug');
});

app.get('/:name.html', function(req,res){
	res.render(req.params.name + '.pug');
});

app.use(session({
	secret: 'secret',
	key: 'keys',
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: null
	},
	saveUninitialized: true,
	resave: false,
	store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.post('/login',function (req,res) {
	//требуем логин и пароль
	if (!req.body.username || !req.body.password) {
		//если нет
		return res.json({status: 'Укажите логин и пароль'});
	}
	if (req.body.username !== user.username || req.body.password !== user.password) {
		res.json({status: 'Логин и/или пароль введены не верно'});
	} else {
		// если верно - помечаем сессию
		req.session.isReg = true;
		res.json({status: 'Добро пожаловать'});
	}
});

function isAuth (req,res,next){
	if (!req.session.isReg){
		return next('none');
	}
	next();
};

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

var blogPost = mongoose.model('blogPost', { postTitle: String, postDate: String, postContent: String });

// сохраняем пост
app.post('/savepost',function(req,res){
	var post = new blogPost (req.body);
	post.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.json({success : "Updated Successfully", status : 200});
			res.end();
		}
	});
});

// покажем посты
app.get('/showpost',function(req,res){
	blogPost.find(function(err,posts){
		if (err) return console.error(err);
		res.render('../extends/_adm-posts.pug', {posts: posts});
		res.end();
	}).sort({postDate:-1});
});

app.get('/blogpage', function (req,res) {
	blogPost.find(function(err,posts){
		if (err) return console.error(err);
		res.render('../extends/_blog-posts.pug', {posts: posts});
		res.end();
	}).sort({postDate:-1});
});

app.get('/blogmenu', function(req,res){
	blogPost.find(function(err,posts){
		if (err) return console.error(err);
		res.render('../extends/_blog-nav.pug', {posts: posts});
		res.end();
	}).sort({postDate:-1});
});

// delete post
app.post('/delete', function (req,res) {
	var id = req.body.id;
	blogPost.findOneAndRemove(id).exec();
	res.json({success : "Updated Successfully", status : 200});
	res.end();
});

app.use(function(req, res, next) {
  res.status(404);
  res.render('error.pug');
});

app.listen(3000);
console.log('Приложение запущено! Port :3000');