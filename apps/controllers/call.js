'use strict';
var express = require('express');
var listAllRoom = require('../common/list-all-room');
var router = express.Router();

router.get('/:roomid/:targetUsername', (req, res) => {
  const {
    roomid, targetUsername
  } = req.params;
  let {
    username,
    name,
    fbid
  } = req.session.user;
  const target = listAllRoom.getUserInfoInRoom(roomid, targetUsername);
  res.render('pages/call/index', {
    data: {
      roomid, username,
      name, fbid, target
    }
  });
});

module.exports = router;
