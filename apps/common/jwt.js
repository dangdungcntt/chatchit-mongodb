'use strict';
let jwt = require('jsonwebtoken');
let config = require('config');

let generateToken = (user) => {
	return jwt.sign(user, config.get('jwt.secret_key'), 
				{
		          expiresIn: config.get('jwt.expiresIn')
		        }
		    );
};

let verifyToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.get('jwt.secret_key'), (err, user) => {
			if (err) {
				return reject(err);
			}
			resolve(user);
		});
	});
	
};
module.exports = {
	generateToken,
	verifyToken
};