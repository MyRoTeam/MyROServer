/** Written by Shreyas Hirday **/


var assert = require('assert');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('../config');

describe('Routing', function(){

  var url = 'https://pure-fortress-98966.herokuapp.com'

  before(function(done){

    mongoose.connect(config.database);
    done();

  });

  describe('User', function(){

    it('should return error for already exising username', function(done){

      var user = {

      username: 'nnelson11',
      password: 'myroandroid'

    };

    request(url).post('/users/').send(user).end(function(err,res){
      if(err) throw err;

      res.status.should.be.equal(500);
      done();


    });

    });

    it('should login successfully', function(done){

      var user = {

      username: 'nnelson11',
      password: 'myroandroid'

    };

    request(url).post('/users/login').send(user).expect(200).end(function(err,res){

      if(err) throw err;

      res.body.success.should.be.equal(true);
      //res.body.message.shoud.be.equal('login successful');
      //res.body.user._id.should.be.equal('56f6d75a03ec301100a9a59b');

      res.body.authToken.should.not.be.equal(null);

      done();

    });

  });

  it('should fail logging in because wrong username', function(done){

    var user = {

    username: 'nn',
    password: 'myroandroid'

  };

  request(url).post('/users/login').send(user).expect(404).end(function(err,res){

    if(err) throw err;

    res.status.should.be.equal(404);

    done();

  });



  });

  it('should fail logging in because wrong password', function(done){

    var user = {

    username: 'nnelson11',
    password: 'myroandroid1'

  };

  request(url).post('/users/login').send(user).expect(401).end(function(err,res){

    if(err) throw err;

    res.status.should.be.equal(401);
    res.body.success.should.be.equal(false);
    res.body.message.should.be.equal('wrong password');

    done();

  });


});



  });

  describe('Places', function(){

    it('should return some places', function(done){


      var lat = 40.4976529;
      var lng = -74.4546441;
      var radius = 500;
      var keyword = "";
      var queryString = "/places?lat=" + lat + "&lng=" + lng + "&radius=" + radius + "&keyword=" + keyword;

      request(url).get(queryString).expect('Content-Type',/json/).expect(200).end(function(err,res){

          if(err) throw err;

          res.body.landmarks.length.should.not.be.equal(0);

          done();

      });

      });

      it('should return no places', function(done){


        var lat = 0;
        var lng = 0;
        var radius = 1;
        var keyword = "";
        var queryString = "/places?lat=" + lat + "&lng=" + lng + "&radius=" + radius + "&keyword=" + keyword;

        request(url).get(queryString).expect('Content-Type',/json/).expect(200).end(function(err,res){

            if(err) throw err;

            res.body.landmarks.length.should.be.equal(0);

            done();

        });

    });




});


});
