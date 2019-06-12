'use strict';

const Koa = require('koa');
const config = require('./config');
const log = require('./common/log');
const middleware = require('./middleware');

const app = new Koa();

// 中间件
middleware(app);

log.info(`-----=====----- env: ${config.env} -----=====-----`);

const server = app.listen(config.port, '0.0.0.0', () => {
  log.info('Listening on port: ' + server.address().port);
});

module.exports = app;
