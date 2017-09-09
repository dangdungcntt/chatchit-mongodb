'use strict';
var express = require('express');

var router = express.Router();

router.get('/:roomid/:iduser', (req, res) => {
  const {
    roomid, iduser
  } = req.params;
  let {
    username,
    name,
    fbid
  } = req.session.user;
  res.render('pages/call/index', {
    data: {
      roomid, username,
      name, fbid, iduser
    }
  });
});

module.exports = router;
