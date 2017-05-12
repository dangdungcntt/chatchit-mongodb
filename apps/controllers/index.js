'use strict';
let express = require('express');
// let user_md = require('../models/user');
// let jwt = require('../common/jwt');
// let shortid = require('shortid');
let account = require('./account');
let router = express.Router();

router.use(account);

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
	res.render('home/home', {
		data: req.session.user
	});
});

router.get('/:string', (req, res) => {
	res.render('comingsoon');
});

module.exports = router;
