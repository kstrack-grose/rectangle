/**
 * @file Creates and adds functionality to the Connection model
*/

var db = require('../config');
var Promise = require('bluebird');
var User = require('../users/user');
var Card = require('../cards/card');

var Connection = db.Model.extend({
  tablename: 'connections',
  hasTimestamps: true,
  user: function() {
    return this.hasOne(User);
  },
  card: function() {
    return this.hasOne(Card);
  }
});
