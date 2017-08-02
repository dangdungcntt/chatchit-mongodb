'use strict';
var mongoose = require('mongoose');

mongoose.connect(process.env.DB_STRING_URL, {
  useMongoClient: true,
  /* other options */
});
mongoose.Promise = require('bluebird');

module.exports = {
  mongoose
};
