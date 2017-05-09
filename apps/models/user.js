'use strict';
var q = require('q');
var db = require('../common/database');

var connection = db.getConnection();

function login(username, password) {
	var defer = q.defer();

	connection.query(
		'SELECT * FROM users WHERE username = ? AND password = ?',
		[username, password], 
		(err, users) => {
			if (err) {
				defer.reject(err);
			} else {
				defer.resolve(users);
			}			
		}
	);

	return defer.promise;
}

module.exports = {
	login
};