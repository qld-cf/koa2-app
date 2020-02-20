'use strict';

const Koa = require('koa');
const config = require('./config');
const log = require('./common/log');
const path = require('path')
const app = new Koa();

if (process.env.NODE_ENV === 'dev') { // 本地快速启动和访问mock json, 无需访问mysql
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  const router = require('koa-router')();
  const fs = require('fs')
  router.get("/", async (ctx, next) => {
    ctx.body = 'Hello World';
  });

  router.get("/mock", async (ctx, next) => {
    let findJson = () => {
      return new Promise((resolve,reject)=>{
          fs.readFile(path.join(__dirname, '/mock/data.json'),function(err,data){
              if(err){
                  resolve({code: -1, msg: '查询失败' + err})
                  return console.error(err);
              }
              let jsonData = JSON.parse(data.toString());//将二进制的数据转换为字符串
              resolve({code: 0, data: jsonData})
          })
      })
    }
    ctx.body = await findJson()
  });

  app.use(router.routes())
  .use(router.allowedMethods());

  app.listen(3000);
  module.exports = app;
  return;
}
const middleware = require('./middleware');

// 中间件
middleware(app);
// console.log(config)
log.info(`-----=====----- env: ${config.env} -----=====-----`);

const server = app.listen(config.port, '0.0.0.0', () => {
  log.info('Listening on port: ' + config.port);
});

module.exports = app;