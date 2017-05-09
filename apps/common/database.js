'use strict';
var config = require('config');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: config.get('mysql.host'),
	port: config.get('mysql.port'),
	username: config.get('mysql.username'),
	password: config.get('mysql.password'),
	database: config.get('mysql.database')
});

connection.connect();

function getConnection() {
	if (!connection) {
		connection.connect();
	}

	return connection;
}
module.exports = {
	getConnection: getConnection
};