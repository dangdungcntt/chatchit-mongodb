'use strict';
var express = require('express');
var config = require('config');
var user_md = require('../models/user');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/checkToken', (req, res) => {
	if (!req.body.token) {
		return res.json({
			status_code: 403
		});
	}
	console.log(req.body);
	let token = req.body.token;
	jwt.verify(token, config.get('secret_key_jwt'), (err, decoded) => {
		if (err) {
	        return res.json({ 
	        	status_code: 403
	        });
	    }
	    req.session.user = decoded;
	    return res.json({
			status_code: 200,
			token: token
		});
	});
});

router.get('/login', (req, res) => {
	if (req.session.user) {
		return res.redirect('/');
	}	
	res.render('login', {
		data: {}
	});
});

router.post('/authenticate', (req, res) => {
	let params = req.body;
	user_md.findOne({
		username: params.username,
		password: params.password
	}, (err, user) => {
		if (err || !user) {
			return res.json({
				status_code: 403,
				error: 'Login failed'
			});
		}
		let userData = {
        	username: user.username, 
		    name: user.name,
		    email: user.email,
		    fbid: user.fbid,
		    admin: user.admin
        };
        //save user
        req.session.user = userData;
		let token = jwt.sign(
			userData, 
			config.get('secret_key_jwt'), 
			{
	          expiresIn: 60 * 60 * 24 * 7
	        }
	    );
		return res.json({
			status_code: 200,
			token
		});
		
	});
	
});

//mid
router.use((req, res, next) => {
	if (!req.session.user) {
		return res.redirect('/login');
	}
	next();
});

router.use('/admin', require('./admin'));
router.use('/user', require('./user'));

router.get('/', (req, res) => {
	res.render('home', {
		data: req.session.user
	});
});

router.get('/:string', (req, res) => {
	res.render('signup');
});

module.exports = router;
