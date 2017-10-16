"use strict"
let express = require("express")
let account = require("./account")
let rootPage = require("./rootPage")
let router = express.Router()

router.use(account)

//mid
router.use((req, res, next) => {
  if (!req.session.user) {
    req.session.redirectUrl = req.url
    return res.redirect("/login")
  }
  next()
})

router.use(rootPage)

router.use("/api", require("./api"))
router.use("/admin", require("./admin"))
router.use("/messages", require("./messages"))
router.use("/profile", require("./profile"))
router.use("/room", require("./room"))
router.use("/call", require("./call"))
module.exports = router
