'use strict';
let jwt = require('jsonwebtoken');
let config = require('config');
let secret_key = process.env.SECRET_KEY_JWT || config.get('jwt.secret_key');

let generateToken = (user, expires) => {
	return jwt.sign(user, secret_key, 
		{
			expiresIn: expires || config.get('jwt.expiresIn')
		}
  );
};

let verifyToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret_key, (err, user) => {
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