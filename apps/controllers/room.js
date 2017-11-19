'use strict';
let express = require('express');
let router = express.Router();

let listAllRoom = require('../common/list-all-room');

router.get('/', (req, res) => {
  res.redirect('../list-room/');
});

router.get('/:id', (req, res) => {
  let roomid = req.params.id;
  let {
    username,
    name,
    fbid
  } = req.session.user;
  if (listAllRoom.checkRoomExists(roomid) === -1) {
    return res.render('layout/1column', {
      page: 'create-room',
      data: {
        roomid,
        username,
        name,
        fbid,
        message: 'Create ' + roomid + ' room now!',
        title: 'Create room'
      }
    });
  }
  let roomname = listAllRoom.getRoomNameById(roomid);
  res.render('layout/1column', {
    page: 'room',
    data: {
      roomid,
      roomname,
      username,
      name,
      fbid,
      baseAPIUpImg: process.env.API_UPLOAD_IMG,
      title: roomname
    }
  });
});

module.exports = router;
