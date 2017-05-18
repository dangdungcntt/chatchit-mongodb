'use strict';
let express = require('express');
let user_md = require('../models/user');
let shortid = require('shortid');
let jwt = require('../helpers/jwt');
let bcrypt = require('../helpers/bcrypt');

let helper = require('../helpers/helper');


let router = express.Router();

router.get('/register', (req, res) => {
	if (req.session.user) {
		return res.redirect('/');
	}	
	req.session._shortidRegister = shortid.generate(); 
	res.render('login-register/index', {
		data: {
			page: 'register',
			_shortid: req.session._shortidRegister
		}
	});
});

router.post('/register', (req, res) => {
	let params = req.body;
	if (params._shortidRegister !== req.session._shortidRegister) {
		return res.json({
				status_code: 403,
				error: ''
		});
	}
	let check = helper.checkUsernamePassword(params);
	if (check.status_code !== 200) {
		return res.json(check);
	}

	user_md.findOne({ //check exists username
		username: params.username,
	})
	.exec((err, user) => {
		if (err || user) {
			return res.json({
				status_code: 345,
				error: 'Username already exists'
			});
		}
		let name = params.name.trim().length === 0 ? params.username : params.name.trim();
		var ac = new user_md({ 
		    username: params.username, 
		    password: bcrypt.hashPassword(params.password),
		    name: name,
		    email: params.email,
		    fbid: '',
		    admin: false,
		    secret: shortid.generate()
		});

		ac.save((err) => {
			if (err) {
				return res.json({
					status_code: 345,
					error: 'Undefined error'
				});
			}
			req.session.newusername = params.username;
			res.json({
				status_code: 200,
			});
		});
	});
});

router.get('/login', (req, res) => {
	if (req.session.user) {
		return res.redirect('/');
	}
	req.session._shortidLogin = shortid.generate(); 
	let newusername = req.session.newusername;	
	let redirectUrl = req.session.redirectUrl;
	res.render('login-register/index', {
		data: {
			page: 'login',
			_shortid: req.session._shortidLogin,
			newusername,
			redirectUrl
		}
	});
});

router.post('/authenticate', (req, res) => {
	let params = req.body;
	if (params._shortidLogin !== req.session._shortidLogin) {
		return res.json({
				status_code: 345,
				error: ''
			});
	}
	user_md.findOne({
		username: params.username,
	}, (err, user) => {
		if (err || !user) {
			return res.json({
				status_code: 345,
				error: 'Username or Password do not match'
			});
		}
		if (!bcrypt.comparePassword(params.password, user.password)) {
			return res.json({
				status_code: 345,
				error: 'Username or Password do not match'
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
		let refreshToken = jwt.generateToken({
        	username: user.username
        }, 86400 * 30); //second param is expiresIn
		return res.json({
			status_code: 200,
			token,
			refreshToken
		});
	});
	
});

router.post('/checkToken', (req, res) => {
	if (!req.body.token) {
		return res.json({
			status_code: 345
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
					status_code: 345,
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
	        let refreshToken = jwt.generateToken({
	        	username: user.username, 
	        }, 86400 * 30);
	        return res.json({
				status_code: 200,
				token,
				refreshToken
			});
		});
	})
	.catch((err) => { //jshint ignore:line
		if (err.expiredAt) { //token expired
			return res.json({
				status_code: 410, //send code expired
			});
		}
		return res.json({
			status_code: 345,
		});
	});
});

router.post('/refreshToken', (req, res) => {
	if (!req.body.refreshToken) {
		return res.json({
			status_code: 345
		});
	}
	jwt.verifyToken(req.body.refreshToken)
	.then((decoded) => {
		user_md.findOne({
			username: decoded.username,
		}, (err, user) => {
			if (err || !user) {
				return res.json({
					status_code: 345,
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
	        let refreshToken = jwt.generateToken({
	        	username: user.username, 
	        }, 86400 * 30);
	        return res.json({
				status_code: 200,
				token,
				refreshToken
			});
		});
	})
	.catch((err) => { //jshint ignore:line
		return res.json({
			status_code: 345,
		});
	});

});

router.post('/logout', (req, res) => {
	if (req.session.user) {
		req.session.user = undefined;
	}
	res.json({
		status_code: 200
	});
});

module.exports = router;