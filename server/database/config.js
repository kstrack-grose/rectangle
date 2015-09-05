/** 
 * @file Creates PostGreSQL schemas
*/
var path = require('path');

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    user: process.env.DATABASE_USER || 'Surya', // change this out as needed
    password: process.env.DATABASE_PW || '',
    database: process.env.DATABASE || 'test', // change this out as needed
    charset: 'utf8'
  }
});

var db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (link) {
      link.increments('id').primary(),
      link.string('firstName', 40),
      link.string('lastName', 40),
      link.string('email', 80).unique(),
      link.string('password', 254),
      link.timestamps()
    }).then(function (table) {
      console.log('created table', table);
    });
  }
});

/**
 * @todo figure out how to contain images
*/

db.knex.schema.hasTable('cards').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('cards', function (link) {
      link.increments('id').primary(),
      link.string('firstName', 40),
      link.string('lastName', 40),
      link.string('email', 80).unique(),
      link.string('company', 40),
      link.string('jobTitle', 80),
      link.string('phone', 14),
      link.integer('userID').references('users.id'),
      link.timestamps()
    }).then(function (table) {
      console.log('created table', table);
    });
  }
});

/**
 * @todo contain gps in connections
*/

db.knex.schema.hasTable('connections').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('connections', function (link) {
      link.increments('id').primary(),
      link.string('createdWhere', 30),
      link.string('QR', 25),
      link.integer('userID').references('users.id'),
      link.integer('cardID').references('cards.id'),
      link.timestamps()
    }).then(function (table) {
      console.log('created table', table);
    });
  }
});

/**
 * @todo create image diagram of relational database
*/

module.exports = db;
