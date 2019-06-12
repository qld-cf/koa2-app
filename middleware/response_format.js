/**
 * response 格式化中间件
 */

'use strict';

const config = require('../config');
const log = require('../common/log');

module.exports = function() {
  return async (ctx, next) => {
    try {
      await next();
      // if (typeof ctx.body === 'object' && !(ctx.body instanceof Stream)) // 这里处理ctx.body不是json情况的判断
      ctx.body = {
        code: 0,
        success: true,
        content: ctx.body,
        message: null,
      };
    } catch (err) {
      /* istanbul ignore next */
      ctx.status = err.status || 200;
      log.warn('server warn:', ctx.request.method, ctx.request.originalUrl, ctx.path, ctx.status);
      log.warn('server warn reqParams:', JSON.stringify(ctx.reqParams, null, '\t'));
      if (config.debug || !err.code) {
        log.error('server warn err', err);
      } else {
        log.warn('server warn err', err);
      }
      ctx.body = {
        code: err.code || 0,
        success: false,
        content: err.content || null,
        message: err.message,
      };
    }
  };
};
