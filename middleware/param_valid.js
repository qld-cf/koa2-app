/**
 * 统一参数校验中间件
 */
'use strict';

const Joi = require('joi');
const SysError = require('../common/sys_error');
const log = require('../common/log');
const errCode = require('../common/error_code');

module.exports = (paramSchema) => {
  return async function(ctx, next) {
    const reqParam = {
      router: ctx.params,
      query: ctx.query,
      body: ctx.request.body,
      headers: ctx.headers,
    };
    ctx.reqParams = reqParam;
    if (!paramSchema) {
      return next();
    }
    let schemaKeys = Object.getOwnPropertyNames(paramSchema);
    if (paramSchema && schemaKeys.length > 0) {
      // 参数检查
      schemaKeys.some(item => {
        let validResult = Joi.validate(reqParam[item], paramSchema[item], {allowUnknown: true});
        if (validResult.error) {
          log.warn('[param error]: ', validResult.error.message);
          ctx.throw(500, new SysError(`参数错误${validResult.error.message}`, errCode.ERROR_PARAMS));
        }
        //使用joi校验过的合法参数，字符串数字会按照joi定义的转成数字
        reqParam[item] = validResult.value;
      });
    }
    await next();
  };
};
