'use strict';

const mongoose = require('mongoose');

const log = require('./log');
const config = require('../config');

const db = mongoose.connection;
mongoose.connect(config.mongodb.url);

db.on('connected', () => {
  log.info('Mongoose default connection open to: ', config.mongodb.url);
});

db.on('error', (err) => {
  log.error('Mongoose connection failed: ', err);
});

db.on('disconnected', () => {
  log.info('Mongoose disconnected...');
});

module.exports = mongoose;
