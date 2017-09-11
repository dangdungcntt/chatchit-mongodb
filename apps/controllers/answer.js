'use strict';
var express = require('express');

var router = express.Router();

router.get('/:roomid/:iduser/:callerId', (req, res) => {
  const {
    roomid, iduser, callerId
  } = req.params;
  let {
    username,
    name,
    fbid
  } = req.session.user;
  res.render('pages/call/answer', {
    data: {
      roomid, username,
      name, fbid, iduser, callerId
    }
  });
});

module.exports = router;
