const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Robot = require('../models/Robot.js');

/******************************
 * UNAUTHENTICATED Routes
 */
router.post('/', function(req, res, next) {
    if (!("name" in req.body && "udid" in req.body)) {
        return res.status(400).send({ 
            success: false,
            message: 'Missing name and/or UDID fields'
        });
    } 

    const robot = {
        name: req.body.name,
        udid: req.body.udid,
        code: Math.random().toString(36).slice(6)
    };

    Robot.create(robot, function(err, robot) {
        if (err) {
            return next(err);
        }

        res.status(201).json(robot);
    });
});

module.exports = router;
