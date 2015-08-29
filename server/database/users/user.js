/**
 * @file Creates and adds functionality to the User model
*/

var db = require('../config');
var Card = require('../cards/card');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  cards: function() {
    return this.hasMany(Card);
  }
});

module.exports = User;

/** 
 * @todo figure out if we authenticate here or client-side
 */
