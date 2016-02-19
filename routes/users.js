const express = require('express');
const router = express.Router();

const config = require('../config');
const jwt = require('jsonwebtoken');
const passwordHasher = require('password-hash');

const mongoose = require('mongoose');

const Robot = require('../models/Robot.js');
const User = require('../models/User.js');

/******************************
 * UNAUTHENTICATED Routes
 */
router.post('/', function(req, res, next) {
    if (!("username" in req.body && "password" in req.body)) {
        // Status: 400, BAD REQUEST - Missing username and/or password parameter(s)
        return res.status(400).send({ 
            success: false,
            error: 'Missing username and/or password fields'
        });
    } else if (!(req.body.username.length > 3 && req.body.password.length >= 8)) {
        return res.status(400).send({ 
            success: false,
            error: 'Username must be atleast 3 characters and the password must be atleast 8 characters'
        });
    }

    const user = {
        username: req.body.username,
        passwordHash: passwordHasher.generate(req.body.password)
    };

    User.create(user, function(err, user) {
        if (err) {
            return next(err);
        }

        res.status(201).json(user);
    });
});

router.post('/login', function(req, res, next) {

  //handle missing information on client side

  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username' : username}, 'username passwordHash', function(err, user){

    if(err) return next(err);

    const hash = user.passwordHash;

    const success = passwordHasher.verify(password, hash);
    const statusCode = success ? 200 : 401;
    var response = {
        success: success,
        message: success ? 'login successful' : 'wrong password'
    };

    if (success) {
        response.user = user;
        response.authToken = jwt.sign(user._id, config.userTokenSecret, {
            expiresIn: 86400
        });
    } 

    res.status(statusCode).send(response);
  });
});


// Authentication Token Middleware
router.use(function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-auth-token'];

    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'No authentication token provided'
        });
    }

    jwt.verify(token, config.userTokenSecret, function(err, decoded) {
        if (err) {
            return res.json({
                success: false,
                message: 'Failed to authenticate provided token'
            });
        }

        req.decoded = decoded;
        next();
    });
});


/**********************************
 * AUTHENTICATED Routes
 */
router.post('/:id/connect', function(req, res, next) {
    if (req.decoded != req.params.id) {
        return res.status(400).send({
            success: false,
            message: 'Invalid user id'
        });
    }

    Robot.findOne({ 'code': req.body.code }, 'udid', function(err, robot) {
        if (err) {
            return next(err);
        }

        return res.status(200).send({
            success: true,
            robotToken: jwt.sign(robot._id, config.robotTokenSecret, {
                expiresIn: 86400
            })
        });
    });
});

router.get('/', function(req, res, next) {
    User.find(function(err, users) {
        if (err) {
            return next(err);
        }

        res.json(users);
    });
});

router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return next(err);
        }

        res.json(user);
    });
});


router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        }

        res.json(user);
    });
});

module.exports = router;
