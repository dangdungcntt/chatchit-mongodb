'use strict';
let express = require('express');
let User = require('../models/user');
let shortid = require('shortid');
let jwt = require('../helpers/jwt');
let bcrypt = require('../helpers/bcrypt');
let helper = require('../helpers/helper');

let router = express.Router();

router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    req.session._shortidRegister = shortid.generate();
    res.render('pages/register', {
        data: {
            _shortid: req.session._shortidRegister
        }
    });
});

router.post('/register', (req, res) => {
    let params = req.body;

    //đóng đăng kí
    // return res.json({
    //   status_code: 403,
    //   error: 'Error'
    // });

    if (params._shortidRegister !== req.session._shortidRegister) {
        return res.json({
            status_code: 403,
            error: ''
        });
    }

    let check = helper.checkUsernamePassword(params);
    if (check.status_code !== 200) {
        return res.json(check);
    }

    User.findOne({ //check exists username
            username: params.username,
        })
        .exec((err, user) => {
            if (err || user) {
                return res.json({
                    status_code: 345,
                    error: 'Username already exists'
                });
            }

            let name = params.name.trim().length === 0 ? params.username : params.name.trim();
            var ac = new User({
                username: params.username,
                password: bcrypt.hashPassword(params.password),
                name: name,
                email: params.email,
                fbid: '',
                admin: false,
                secret: shortid.generate()
            });

            ac.save((err) => {
                if (err) {
                    return res.json({
                        status_code: 345,
                        error: 'Undefined error'
                    });
                }
                req.session.newusername = params.username;
                res.json({
                    status_code: 200,
                });
            });
        });
});

router.get('/login', (req, res) => {

    if (req.session.user) {
        return res.redirect('/');
    }

    req.session._shortidLogin = shortid.generate();
    let newUsername = req.session.newusername;
    let redirectUrl = req.session.redirectUrl;
    res.render('pages/login', {
        data: {
            _shortid: req.session._shortidLogin,
            newusername: newUsername,
            redirectUrl
        }
    });
});

router.post('/authenticate', (req, res) => {
    console.log(req.body);
    let params = req.body;
    if (params._shortidLogin !== req.session._shortidLogin) {
        return res.json({
            status_code: 345,
            error: ''
        });
    }
    User.findOne({
        username: params.username,
    }, (err, user) => {
        if (err || !user) {
            return res.json({
                status_code: 345,
                error: 'Username or Password do not match'
            });
        }
        if (!bcrypt.comparePassword(params.password, user.password)) {
            return res.json({
                status_code: 345,
                error: 'Username or Password do not match'
            });
        }
        let userData = {
            username: user.username,
            name: user.name,
            email: user.email,
            fbid: user.fbid,
            admin: user.admin,
            secret: user.secret
        };
        //save user
        req.session.user = userData;
        let token = jwt.generateToken(userData);
        let refreshToken = jwt.generateToken({
            username: user.username
        }, 86400 * 30); //second param is expiresIn
        return res.json({
            status_code: 200,
            token,
            refreshToken
        });
    });

});

router.post('/checkToken', async (req, res) => {
    if (!req.body.token) {
        return res.json({
            status_code: 345
        });
    }

    let decoded = await jwt.verifyToken(req.body.token).catch((err) => { //jshint ignore:line
        if (err.expiredAt) { //token expired
            return 410;
        }
        return 345;
    });

    if (decoded === 410 || decoded === 345) {
        return res.json({
            status_code: 410, //send code expired
        });
    }

    User.findOne({
        username: decoded.username,
        secret: decoded.secret
    }, (err, user) => {
        if (err || !user) {
            return res.json({
                status_code: 345,
            });
        }
        let userData = {
            username: user.username,
            name: user.name,
            email: user.email,
            fbid: user.fbid,
            admin: user.admin,
            secret: user.secret
        };

        req.session.user = userData;
        let token = jwt.generateToken(userData);
        let refreshToken = jwt.generateToken({
            username: user.username,
        }, 86400 * 30);

        return res.json({
            status_code: 200,
            token,
            refreshToken
        });
    });
});

router.post('/refreshToken', (req, res) => {
    if (!req.body.refreshToken) {
        return res.json({
            status_code: 345
        });
    }

    jwt.verifyToken(req.body.refreshToken)
        .then((decoded) => {
            User.findOne({
                username: decoded.username,
            }, (err, user) => {
                if (err || !user) {
                    return res.json({
                        status_code: 345,
                    });
                }
                let userData = {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    fbid: user.fbid,
                    admin: user.admin,
                    secret: user.secret
                };
                req.session.user = userData;
                let token = jwt.generateToken(userData);
                let refreshToken = jwt.generateToken({
                    username: user.username,
                }, 86400 * 30);
                return res.json({
                    status_code: 200,
                    token,
                    refreshToken
                });
            });
        })
        .catch((err) => { //jshint ignore:line
            return res.json({
                status_code: 345,
            });
        });

});

router.post('/logout', (req, res) => {
    if (req.session.user) {
        req.session.user = undefined;
    }
    res.json({
        status_code: 200
    });
});

module.exports = router;
