"use strict";
var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("messages", {
    data: {
      user: req.session.user
    }
  });
});

module.exports = router;
