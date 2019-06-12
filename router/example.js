'use strict';

const {exampleCtrl} = require('../controller');
const {mobileSchema} = require('../schema');

// 路由列表
module.exports = [
  //登录获取token
  {
    method: 'post',
    path: '/auth/login',
    controller: exampleCtrl.login,
  },
  {
    method: 'get',
    path: '/auth/verification',
    controller: exampleCtrl.verification,
  },
  //上传解析excel
  {
    method: 'post',
    path: '/auth/upload/excel',
    controller: exampleCtrl.uploadExcel,
  },
  // 获取爬虫天气
  {
    method: 'get',
    path: '/koa/weather',
    controller: exampleCtrl.weather,
  },
  // 获取手机品牌
  {
    method: 'get',
    path: '/koa/mobile',
    controller: exampleCtrl.mobile,
    //参数验证
    paramSchema: mobileSchema.brandSchema,
  },
];
