/**
 * @file test server functionality
 */
var chai = require("chai");
var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var app = require('../server.js');
var userController = require('../users/userController.js');
var cardController = require('../cards/cardController.js');
var connectionController = require('../connections/connectionController.js');

var User = require('../database/users/user');
var Users = require('../database/users/users');
var Card = require('../database/cards/card');
var Cards = require('../database/cards/cards');
var Connection = require('../database/connections/connection');
var Connections = require('../database/connections/connections');


// variable to toggle between local and deployed server
var production = true;
var api = production ? supertest('https://tranquil-earth-7083.herokuapp.com/') : supertest('http://localhost:5000');

/**
 * Test all of the routes that the API will and will not support
 */

describe('routing test', function () {
  it("route '/'' should return 404", function (done) {
    api.get('/')
      .set('Accept', 'application/json')
      .expect(404, done);
  });

  it("users routing get", function (done) {
    api.get('/users/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(404, done)
  });

  it("users routing post", function (done) {
    api.post('/users/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(404, done)
  });

  it("cards routing get/post", function (done) {
    api.get('/cards/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        expect(res.status).to.equal(404);
        done();
      });
  });

  it("connections routing get/post", function (done) {
    api.get('/connections/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        expect(res.status).to.equal(404);
        done();
      });
  });

});


/**
 * test the connection between the server and the database
 */
describe('connecting to the database', function () {

  if (!production) {

    it('should not add users to the database when email is empty using POST', function (done) {
      api.post('/users/signup/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          var resText = JSON.parse(res.text);
          expect(JSON.stringify(resText)).to.equal(JSON.stringify({
            error: "enter your email"
          }));
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should not signin a user if email is empty', function (done) {
      api.post('/users/signin/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          var resText = JSON.parse(res.text);
          expect(JSON.stringify(resText)).to.equal(JSON.stringify({
            error: "user doesn't exist"
          }));
          expect(res.status).to.equal(400);
          done();
        });
    });


  } else {

    it('should not add users to the database when email is empty using POST', function (done) {
      api.post('users/signup/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          var resText = JSON.parse(res.text);
          expect(JSON.stringify(resText)).to.equal(JSON.stringify({
            error: "email is not provided/invalid"
          }));
          expect(res.status).to.equal(400);
          done();
        });
    });

    it("should not signin a user if email is empty", function (done) {
      api.get('/users/signin')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(404, done)
    });

    it('should get locations for all connections', function (done) {
      api.post('connections/getlocations')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect("Cannot POST /connections/getlocations\n")
        .expect(404, done)
    });
  }

  it("cards routing get/post", function (done) {
    api.get('/cards/getcards/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        expect(res.status).to.equal(404);
        done();
      });
  });

  it("cards routing get/post", function (done) {
    api.get('/cards/createcard/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        expect(res.status).to.equal(404);
        done();
      });
  });

  it("connections routing get/post", function (done) {
    api.get('/connections/createconnection/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        expect(res.status).to.equal(404);
        done();
      });
  });

  it("connections routing get/post", function (done) {
    api.get('/connections/deleteconnection/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        expect(res.status).to.equal(404);
        done();
      });
  });

  it("connections get all connections post", function (done) {
    api.get('/connections/getconnections/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        expect(res.status).to.equal(404);
        done();
      });
  });

  it("get qr codes from server", function (done) {
    api.get('/qr/getQR/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /svg+xml/)
      .expect(200)
      .end(function (err, res) {
        expect(typeof res.body).to.equal("object");
        done();
      });
  });
});
