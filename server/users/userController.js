var User = require('../database/users/user.js');
var Users = require('../database/users/users.js');
var Promise = require("bluebird");

/** 
 * userRoutes is an object that contains the routes for '/users' in our API
*/
var userRoutes = {
  /**
   * @function to sign the user in, comparing hashed passwords
   * @param {object} HTTP request object
   * @param {object} HTTP response object
  */
  signin: function (req, res) {
    return new Promise(function (resolve, reject) {
      return new User({
          email: req.body.email
        })
        .fetch()
        .then(function (user) {
          if (!user) {
            // HERE we would redirect to signup
            // confer with front end
            res.end(JSON.stringify({
              error: "user doesn't exist"
            }));
          } else {
            user.comparePassword(req.body.password)
            .then(function(isMatch) {
              res.end(JSON.stringify(isMatch));
            });
          }
        })
    })
    console.log("all routes");
    res.json({
      message: "user get message"
    });
  },
  /**
   * @function to sign the user up and hash the password
   * @param {object} HTTP request object
   * @param {object} HTTP response object
  */
  signup: function (req, res) {
    return new Promise(function (resolve, reject) {
      Users.query({
        where: {
          email: req.body.email
        }
      }).fetchOne().then(function (user) {
        if (user) {
          console.log('!!!!!!!!!!!', user);
          res.end(JSON.stringify({
            error: "Email already exists"
          }));
        } else if (req.body.email) {
          console.log(37, "email provided");
          return new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
          }).save().then(function (newUser) {
            console.log(20, newUser);
            res.end(JSON.stringify(newUser));
          }).catch(function (err) {
            console.log(new Error(err));
            res.end(JSON.stringify(err));
          })
        } else {
          console.log(51, req.body);
          res.end(JSON.stringify({
            error: 'enter your email'
          }));
        }
      })
    });
  }
}

module.exports = userRoutes;
