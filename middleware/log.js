/**
 * 日志中间件
 */
'use strict';

const log = require('../common/log');
const errCode = require('../common/error_code');

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.request.originalUrl === '/favicon.ico') {
      return;
    }
    let ip = ctx.request.ip.indexOf('::ffff:') !== -1
      ? ctx.request.ip.substr(7)
      : ctx.request.ip;
    ip = ip.indexOf('::1') !== -1
      ? '127.0.0.1'
      : ip;
    let startTime = new Date();
    ctx.errCode = errCode;
    await next();
    let time = (new Date() - startTime) + 'ms';
    log.info('[request log]: ', ip, ctx.request.method, ctx.request.originalUrl, time);
  };
};
