"use strict";
// get an instance of mongoose and mongoose.Schema
var mongoose = require("../common/database").mongoose;
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model(
  "Emoji",
  new Schema({
    name: String,
    list: Array
  })
);
