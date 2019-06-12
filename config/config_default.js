'use strict';

const moment = require('moment');
const pkg = require('../package.json');

const dateFormat = function() {
  return '[' + moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ']';
};

module.exports = {
  debug: true,
  projectName: 'koa',
  env: 'dev',
  port: 3000,
  jwtSecret: 'mapleChain',
  globalConfigFile: `/opt/conf/${pkg.name}/config.js`,
  logger: {
    dev: {
      name: 'dev',
      level: 'debug',
      json: false,
      colorize: 'all',
      localTime: true,
      label: process.pid,
      timestamp: dateFormat,
    },
    prd: {
      name: 'prd',
      level: 'info',
      json: false,
      colorize: false,
      localTime: true,
      label: process.pid,
      timestamp: dateFormat,
      datePattern: 'YYYY-MM-DD',
      filename: 'server.%DATE%.log',
      dirname: `/data/${pkg.name}/logs/`,
      maxFiles: '60d',
    },
  },
  mysql: {
    user: 'root',
    password: '123',
    database: 'koa',
    orm: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      pool: {
        max: 100,
        min: 0,
        idle: 10000,
        handleDisconnects: true,
      },
      dialectOptions: {
        connectTimeout: 10000,
      },
      logging: true,
      //时区
      timezone: '+08:00',
    },
  },
  urlPrefix: {
    prefix: '/api/v1',
  },
};
