"use strict";
let express = require("express");
let listAllRoom = require("../common/list-all-room");
let router = express.Router();

router.get("/", (req, res) => {
  res.render("layout/1column", {
    page: "home",
    data: req.session.user
  });
});

router.get("/list-room", (req, res) => {
  res.render("layout/1column", {
    page: "list-room",
    data: req.session.user
  });
});

router.get("/create-room", (req, res) => {
  let { username, name, fbid } = req.session.user;
  res.render("layout/1column", {
    page: "create-room",
    data: {
      username,
      name,
      fbid,
      message: "Create Room"
    }
  });
});

router.post("/create-room", (req, res) => {
  if (listAllRoom.checkRoomExists(req.body.roomid) > -1) {
    return res.json({
      status_code: 345,
      error: "Room already exists"
    });
  }
  let { roomid, roomname, roomimage, master } = req.body;
  let room = {
    roomid,
    roomname,
    roomimage,
    master,
    listUser: []
  };
  listAllRoom.pushRoom(room);
  return res.json({
    status_code: 200,
    room
  });
});

router.get("/redirect/current", (req, res) => {
  res.redirect(req.session.redirectUrl || "/");
});
router.get("/:string", (req, res) => {
  res.render("comingsoon");
});

module.exports = router;
