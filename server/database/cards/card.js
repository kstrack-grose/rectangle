/**
 * @file Creates and adds functionality to the Card model
*/

var db = require('../config');
var User = require('../users/user');
var Promise = require('bluebird');

var Card = db.Model.extend({
  tableName: 'cards',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = Card;
