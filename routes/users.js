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
    /* Request must have username and password parameters */
    if (!("username" in req.body && "password" in req.body)) {
        return res.status(400).send({
            success: false,
            error: 'Missing username and/or password fields'
        });
    } else if (!(req.body.username.length > 3 && req.body.password.length >= 8)) { /* Username must be atleast three characters and password must be atleast eight characters */
        return res.status(400).send({
            success: false,
            error: 'Username must be atleast 3 characters and the password must be atleast 8 characters'
        });
    }

    const user = {
        username: req.body.username,
        passwordHash: passwordHasher.generate(req.body.password) /* Generates a one way hash for supplied password */
    };

    User.create(user, function(err, user) {
        if (err) {
            return next(err);
        }

        res.status(201).json(user);
    });
});

router.post('/login', function(req, res, next) {

  console.log("hit login");

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send({
        success: false,
        message: "both username and password required"
    });
  }

  /* Find the User object from database that matches the username parameter */
  User.findOne({'username' : username}, 'username passwordHash', function(err, user) {
    if(err) return next(err);


    /* Unable to find User object with the supplied username */
    if (!user) {
        return res.status(404).send({
            success: false,
            message: "invalid username"
        });
    }

    const hash = user.passwordHash;

    const success = passwordHasher.verify(password, hash); /* Check if password hashes match */
    const statusCode = success ? 200 : 401;
    var response = {
        success: success,
        message: success ? 'login successful' : 'wrong password'
    };

    if (success) {
        response.user = user;

        /*
         * Generates an authentication token that users must supply
         * on all other api requests, otherwise they will be returned
         * a status code of 403 (UNAUTHORIZED)
         */
        response.authToken = jwt.sign({ "id": user._id }, config.userTokenSecret, {
            expiresIn: 86400
        });
    }

    res.status(statusCode).send(response);
  });
});


// Authentication Token Middleware
router.use(function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-auth-token']; /* Try to find auth token in body, url, or header */

    /* If auth token is not supplied, then the request cannot be fulfilled */
    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'no authentication token provided'
        });
    }

    /* Check if supplied auth token is a valid and existing token */
    jwt.verify(token, config.userTokenSecret, function(err, decoded) {
        if (err) {
            return res.json({
                success: false,
                message: 'failed to authenticate provided token'
            });
        }

        req.userId = decoded.id ; /* Stores the corresponding user's id that we used to sign an auth token */
        next();
    });
});


/**********************************
 * AUTHENTICATED Routes
 */
router.post('/:id/connect', function(req, res, next) {
    /* If there is no value for decoded, that means that the auth token is invalid */
    if (req.userId != req.params.id) {
        return res.status(400).send({
            success: false,
            message: 'invalid user id'
        });
    }

    if (!req.body.code) {
        return res.status(400).send({
            success: false,
            message: 'robot code required'
        });
    }

    /* Find Robot object that has the supplied code */
    Robot.findOne({ 'code': req.body.code }, 'udid', function(err, robot) {
        if (err) {
            return next(err);
        }

        if (!robot) {
            return res.status(404).send({
                success: false,
                message: "invalid robot code"
            });
        }

        return res.status(200).send({
            success: true,

            /*
             * Generates a token that must be supplied with each websocket
             * request when sending instructions through the websocket,
             * otherwise the requests will fail
             */
            robotToken: jwt.sign({ "udid": robot.udid }, config.robotTokenSecret, {
                expiresIn: 86400
            })
        });
    });
});


/* Read All, Update One, Get One Generic Methods */

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

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "invalid user id"
            });
        }

        res.json(user);
    });
});


router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "invalid user id"
            });
        }

        res.json(user);
    });
});

module.exports = router;
