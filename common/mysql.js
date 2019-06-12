'use strict';

const log = require('./log');
const config = require('../config').mysql;
const Sequelize = require('sequelize');
const operatorsAliases = require('./operators_aliases');

config.orm.operatorsAliases = operatorsAliases;
let pool = new Sequelize(config.database, config.user, config.password, config.orm);

pool.authenticate()
  .then(() => {
    log.info('DB Connection has been established successfully');
  })
  .catch(err => {
    log.error('Unable to connect to the database', err);
  });

module.exports = {
  pool,
  Sequelize,
};