"use strict";
var express = require("express");

var router = express.Router();

router.get("/", (req, res) => {
  /*res.json({
  	message: 'Admin page'
  });*/
  res.render("comingsoon");
});

module.exports = router;
