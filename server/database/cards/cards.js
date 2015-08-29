/**
 * @file Creates and adds functionality to the Cards collection
*/

var db = require('../config');
var Card = require('./card');

var Cards = new db.Collection();

Cards.model = Card;

module.exports = Cards;
