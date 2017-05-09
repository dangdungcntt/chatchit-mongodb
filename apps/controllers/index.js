'use strict';
var express = require('express');
// var user_md = require('../models/user');

var router = express.Router();

// router.post('checkLogin', (req, res) => {
// 	if (!req.body.token) {
// 		return res.json({
// 			status_code: 403
// 		});
// 	}
// 	let token = req.body.token;
// 	if (token === 'demojwt') {
// 		let user = {
// 			username: 'teo',
// 			password: '123'
// 		};
// 		return res.json({
// 			status_code: 200,
// 			user
// 		});
// 	}
// 	return res.json({
// 		status_code: 403,
// 	});
// });

// router.get('/login', (req, res) => {
// 	if (req.session.user) {
// 		return res.redirect('/');
// 	}	
// 	res.render('login', {
// 		data: {}
// 	});
// });

// router.post('/login', (req, res) => {
// 	let params = req.body;
// 	// console.log(params);
// 	user_md.login(params.username, params.password)
// 	.then((users) => {
// 		if (users.length === 0) {
// 			return res.render('login', {
// 				data: {
// 					error: 'Login failed'
// 				}
// 			});
// 		}
// 		req.session.user = users[0];
// 		res.redirect('/');
// 	}).catch((err) => {
// 		console.log(err);
// 		res.render('login', {
// 			data: {
// 				error: 'Login failed'
// 			}
// 		});
// 	});
	
// });

// //mid
// router.use((req, res, next) => {
// 	if (!req.session.user) {
// 		return res.redirect('/login');
// 	}
// 	next();
// });

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
