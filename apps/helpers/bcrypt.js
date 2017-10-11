"use strict";
let bcrypt = require("bcrypt");
let config = require("config");

let hashPassword = password => {
  let saltRounds = config.get("bcrypt.salt");
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
};

let comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
module.exports = {
  hashPassword,
  comparePassword
};
