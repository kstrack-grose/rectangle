var Card = require('../database/cards/card');
var Cards = require('../database/cards/cards');
var User = require('../database/users/user');
var Users = require('../database/users/users');
var Connection = require('../database/connections/connection');
var Connections = require('../database/connections/connections');
var Promise = require("bluebird");

/**
 * @exports a routes object for the connection REST API calls
*/
var connectionRoutes = {
  /**
   * @function createConnection creates a connection between a user
   * and another user's card and inserts into connection table
   * @param {object} 'req' the request sent to the server
   * @param {object} 'res' the response sent from the server
  */
  createConnection: function (req, res) {
    return new Promise(function (resolve, reject) {
      return Users.query({
        where: {
          email: req.body.email
        }
      }).fetch().then(function (users) {
        var userID;
        if (users.models.length > 0) {
          userID = users.models[0].get("id");
        }
        return Cards.query({
          where: {
            email: req.body.cardEmail
          }
        }).fetch().then(function (cards) {
          var cardID;
          if (cards.models.length > 0) {
            cardID = cards.models[0].get("id");
          }
          return Connections.query({
            where: {
              user_id: userID,
              card_id: cardID
            }
          }).fetch().then(function (connection) {
            if (connection.length < 1 && req.body.cardEmail !== req.body.email && userID && cardID) {
              return new Connection({
                user_id: userID,
                card_id: cardID
              }).save().then(function (newConnection) {
                res.status(200).send({
                  message: newConnection
                });
              }).catch(function (err) {
                console.log(new Error(err));
                res.status(500).send({
                  error: err
                });
              });
            } else if (!userID) {
              res.status(400).send({
                error: "invalid user email"
              });
            } else if (!cardID) {
              res.status(400).send({
                error: "invalid card email"
              });
            } else {
              res.status(400).send({
                error: "connection already exists"
              });
            }
          }).catch(function (err) {
            res.status(400).send({
              error: "password/email does not match"
            });
          });
        });
      });
    });
  },
  /**
   * @function deleteConnection deletes a connection between user
   * and another user's card from the connections table in the db
   * @param {object} 'req' the request sent to the server
   * @param {object} 'res' the response sent from the server
  */
  deleteConnection: function (req, res) {
    var p = new Promise(function (resolve, reject) {
      return Users.query({
        where: {
          email: req.body.email
        }
      }).fetch().then(function (users) {
        var userID = users.models[0].get("id");
        return Cards.query({
          where: {
            email: req.body.cardEmail
          }
        }).fetch().then(function (cards) {
          if (cards.models.length > 0) {
            var cardID = cards.models[0].get("id");
            return Connections.query({
              where: {
                user_id: userID,
                card_id: cardID
              }
            }).fetch().then(function (con) {
              console.log(72, con);
              if (con.length > 0) {
                con.models[0].destroy().then(function (model) {
                  res.status(200).send({
                    message: "deleted"
                  });
                });
              } else {
                res.status(400).send({
                  error: "connection does not exist"
                });
              }
            });
          } else {
            res.status(400).send({
              error: "card does not exist"
            });
          }
        });
      });
    });
  },
  /**
   * @function getConnection sends all of the cards that a user
   * is connected to in the connections table back to the client
   * @param {object} 'req' the request sent to the server
   * @param {object} 'res' the response sent from the server
  */
  getConnections: function (req, res) {
    return new User({
      email: req.body.email
    }).fetch({
      withRelated: ['cards']
    })
    .then(function (user) {
      res.send(JSON.stringify(user.related('cards')));
      console.log(179, user.related('cards'));
    }).catch(function (err) {
      res.status(500).send({
        error: err
      });
    });
  }
};

module.exports = connectionRoutes;
