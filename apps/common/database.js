'use strict';
let mongoose = require('mongoose');

mongoose.connect(process.env.DB_STRING_URL, {
  useMongoClient: true
});

mongoose.Promise = require('bluebird');

module.exports = {
  mongoose
};
