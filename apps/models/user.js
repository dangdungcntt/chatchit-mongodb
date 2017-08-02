'use strict';
// get an instance of mongoose and mongoose.Schema
var mongoose = require('../common/database').mongoose;
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  fbid: String,
  admin: Boolean,
  secret: String
}));
