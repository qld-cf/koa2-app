'use strict';

const fs = require('fs');

const Router = require('koa-router');
const middlewareParamCheck = require('../middleware/param_valid');
const log = require('../common/log');
const config = require('../config');

const router = new Router(config.urlPrefix);


function addToRouter(routers) {
  // 加载api路由列表
  routers.forEach(item => {
    log.debug('router', item.method, item.path);
    let method = item.method ? item.method : 'all';
    if (item.permission) {
      if (!Array.isArray(item.permission)) {
        item.permission = [item.permission];
      }
      router[method](item.path, middlewareParamCheck(item.paramSchema), ...item.permission, item.controller);
    } else {
      router[method](item.path, middlewareParamCheck(item.paramSchema), item.controller);
    }
  });
}

// 聚合路由
const files = fs.readdirSync(__dirname);
files.forEach((file) => {
  if (file !== 'index.js') {
    addToRouter(require(`./${file}`));
  }
});

module.exports = router;
