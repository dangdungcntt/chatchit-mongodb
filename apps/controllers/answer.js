'use strict';
var express = require('express');
var listAllRoom = require('../common/list-all-room');
var router = express.Router();

router.get('/:roomid/:targetUsername/:callerId', (req, res) => {
  const {
    roomid, targetUsername, callerId
  } = req.params;
  let {
    username,
    name,
    fbid
  } = req.session.user;
  const target = listAllRoom.getUserInfoInRoom(roomid, targetUsername);
  res.render('pages/call/answer', {
    data: {
      roomid, username,
      name, fbid, callerId, target
    }
  });
});

module.exports = router;
