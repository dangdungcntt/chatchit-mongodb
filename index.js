'use strict';
var express = require('express');
var session = require('express-session');
var config = require('config');
var bodyParser = require('body-parser');

var app = express();

//body-parser for get data from post form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//session
app.set('trust proxy', 1); //trust first proxy
app.use(session({
	secret: config.get('secret_key_session'),
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

//set template ejs, static folder
app.set('views', './apps/views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));

//controller for define route
var controllers = require('./apps/controllers');
app.use(controllers);


// var host = config.get('server.host');
var port = config.get('server.port');
var server = app.listen(process.env.PORT || port, () => {
	console.log('Server running on PORT ' + port);
});

var io = require('socket.io')(server);
require('./apps/common/socketcontrol')(io);

