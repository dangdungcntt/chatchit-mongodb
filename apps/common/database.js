'use strict';
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(process.env.DB_STRING_URL);
mongoose.Promise = require('bluebird');

module.exports = {
	mongoose
};