const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Robot = require('../models/Robot.js');

/******************************
 * Helper Methods
 */

/*
 * Generates a random six digit alphanumeric string
 * using epoch time and another randomly generated
 * alphanumeric string
 */
function generateRandomCode() {
    var epoch = new Date().getTime() % 1000; /* Get current epoch time */
    if (epoch <= 255) epoch += 255; /* If the last three digits of epoch time are below 255, then we must increment it to get three hexadecimal digits */

    const hex = epoch.toString(16);
    var random = Math.random().toString(36);
    random = random.substr(random.length - 3);

    console.log(epoch);
    console.log(hex);
    console.log(random);

    var code = "";
    for (var i = 0; i < 3; ++i) {
        code += random[i] + hex[i];
    }

    return code;
}

/******************************
 * UNAUTHENTICATED Routes
 */
router.post('/', function(req, res, next) {

    console.log("hit robots");

    //Robot.remove({}, function(e){});
    /* Request must have name and udid parameter */
    if (!("name" in req.body && "udid" in req.body)) {
        return res.status(400).send({
            success: false,
            message: 'missing name and/or UDID fields'
        });
    } else if (req.body.udid.length < 4) {
        return res.status(400).send({
            success: false,
            message: "udid must be atleast three characters long"
        });
    }

    const robot = {
        name: req.body.name,
        udid: req.body.udid,
        code: generateRandomCode()
    };

    Robot.create(robot, function(err, robot) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.status(201).json(robot);
    });
});

router.get('/findByUdid',function(req,res,next){

  var udidval = req.query.udid;

  Robot.findOne({udid : udidval}, 'name udid code', function(err, robot){

      if(err) return next(err);

      var found = robot === null;

      var response = {
        status : found ? 'OK' : 'ERROR',
      };

      if(found) response.robotObj = robot;

      res.status(200).send(response);


  });

});

router.get('/:id', function(req, res, next) {
    Robot.findById(req.params.id, function(err, robot) {
        if (err) next(err);

        if (!robot) {
            return res.status(404).send({
                success: false,
                message: "invalid robot id"
            });
        }

        return res.json(robot);
    });
});

module.exports = router;
