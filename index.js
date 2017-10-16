'use strict'
require('dotenv').config()
let express = require('express')
let session = require('express-session')
let config = require('config')
let bodyParser = require('body-parser')

var app = express()

//body-parser for get data from post form
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//session
app.set('trust proxy', 1) //trust first proxy
app.use(
  session({
    secret: process.env.SECRET_KEY_SESSION || config.get('secret_key_session'),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
)

//set template ejs, static folder
app.set('views', './apps/views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))

//controller for define route
var controllers = require('./apps/controllers')
app.use(controllers)

// var host = config.get('server.host');
let port = process.env.PORT || config.get('server.port')
let server = app.listen(port, () => {
  console.log('Server running on PORT ' + port)
})

let io = require('socket.io')(server)
require('./apps/common/socketcontrol')(io)
