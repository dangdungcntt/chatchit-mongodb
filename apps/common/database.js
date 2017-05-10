'use strict';
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.get('database'));
mongoose.Promise = require('bluebird');

module.exports = {
	mongoose
};