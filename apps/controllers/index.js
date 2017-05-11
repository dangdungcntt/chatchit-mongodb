'use strict';
let express = require('express');
let user_md = require('../models/user');
let jwt = require('../common/jwt');
let router = express.Router();

router.post('/checkToken', (req, res) => {
	if (!req.body.token) {
		return res.json({
			status_code: 403
		});
	}

	jwt.verifyToken(req.body.token)
	.then((decoded) => {
		user_md.findOne({
			username: decoded.username,
			secret: decoded.secret
		}, (err, user) => {
			if (err || !user) {
				return res.json({
					status_code: 403,
				});
			}
			let userData = {
	        	username: user.username, 
			    name: user.name,
			    email: user.email,
			    fbid: user.fbid,
			    admin: user.admin,
			    secret: user.secret
	        };
	        req.session.user = userData;
	        let token = jwt.generateToken(userData);
	        return res.json({
				status_code: 200,
				token
			});
		});
	})
	.catch((err) => { //jshint ignore:line
		return res.json({
			status_code: 403,
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
		    admin: user.admin,
		    secret: user.secret
        };
        //save user
        req.session.user = userData;
		let token = jwt.generateToken(userData);
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

router.use('/chat-room', require('./chat-room'));
router.use('/admin', require('./admin'));
router.use('/profile', require('./profile'));

router.get('/', (req, res) => {
	res.render('home', {
		data: req.session.user
	});
});

router.get('/:string', (req, res) => {
	res.render('comingsoon');
});

module.exports = router;
