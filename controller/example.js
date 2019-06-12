
const {User} = require('../model');
const config = require('../config');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mkdirp = require('mkdirp');
const formidable = require('formidable');
const AppError = require('../common/sys_error');
const industryExcel = require('./excel');
const mobileService = require('../service/example');
const util = require('../common/util');

const existsFile = async (path) => {
  const exists = fs.existsSync(path);

  if (!exists) {
    mkdirp.sync(path);
  };
  return exists;
};

const verifyToken = async (token, errCode) => {
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      throw new AppError(err, errCode.ERROR_ACCESS_TOKEN);
    }
    return decoded;
  });
};

const asyncParse = (ctx, form) => {
  return new Promise((resolve, reject) => {
    form.parse(ctx.req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve({fields, files});
    });
  });
};

exports.login = async (ctx) => {
  const {password} = ctx.request.body;
  let result = await User.findOne({
    where: {
      password,
    },
  });

  if (!result) {
    throw new AppError('密码错误', ctx.errCode.ERROR_LOGIN);
  } else {
    let token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    }, config.jwtSecret);

    ctx.body = {token};
  }
};

// 校验token是否有效
exports.verification = async (ctx) => {
  const {token} = ctx.query;
  await verifyToken(token, ctx.errCode);

  ctx.body = {
    isLogin: true,
  };
};

exports.uploadExcel = async (ctx) => {
  const {token} = ctx.headers;
  await verifyToken(token, ctx.errCode);
  const form = new formidable.IncomingForm();
  let {files} = await asyncParse(ctx, form);
  const path = 'upload/mobile';
  await existsFile(path);

  form.uploadDir = path;
  form.encoding = 'utf-8';
  form.keepExtensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;

  await industryExcel.readExcel(files.src.path, files.src.name);
  ctx.body = '解析成功';
};


// 天气
exports.weather = async (ctx) => {
  let realData = await util.handleProxyReqReal();
  let pmData = await util.handleProxyReqPM();
  let result = {
    topA: [
      {
        name: '温度',
      }, {
        name: '湿度',
      }, {
        name: 'PM2.5',
      }, {
        name: 'PM10',
      }, {
        name: '环境指数',
      },
    ],
  };
  if (realData.error_code === 103) {
    throw new AppError('api不存在,请补充api所需要的appid', ctx.errCode.ERROR_DATA_NOT_FOUND);
  }
  if (realData && pmData) {
    result.topA[0].value = parseInt(realData.data.now_temperature.substr(0, 2));
    result.topA[1].value = parseInt(realData.data.now_humidity.substr(0, 2));
    result.topA[4].value = realData.data.now_rcomfort;
    result.topA[2].value = pmData.pm25;
    result.topA[3].value = pmData.pm10;
  } else {
    let res = await smartService.getWeatherMsg();
    res.map(e => {
      result.topA[0].value = e.temperature || 0;
      result.topA[1].value = e.humidity || 0;
      result.topA[2].value = e.pm25 || 0;
      result.topA[3].value = e.pm10 || 0;
      result.topA[4].value = e.envIndex || 0;
    });
  }
  ctx.body = result;
};


// 获取手机品牌
exports.mobile = async (ctx) => {
  let result = [];
  const {name} = ctx.reqParams.query;
  let res = await mobileService.mobileBrand(name);
  res.map(e => {
    result.push({
      name: e.name,
      rank: e.rank,
    });
  });
  ctx.body = result;
};