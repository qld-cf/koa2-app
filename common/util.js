/*
 * 常规工具类函数
 */

'use strict';

const log = require('./log');
const _ = require('lodash');
const cheerio = require('cheerio');
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));


exports.rid = () => {
  return uuid().replace(/\-/g, '');
};

exports.uuid = () => {
  return uuid().replace(/\-/g, '');
};


/**
 * 首字母大写
 * @param {字符串} str
 */
exports.firstUpperCase = function(str) {
  if (!exports.isType(exports.TYPE.String, str)) {
    throw new TypeError(`${str} is not string`);
  }
  return str.replace(/^\S/, s => {
    return s.toUpperCase();
  });
};



/**
 * 中文名称转换对应英文
 * @param data {Array} 需转换的数组
 * @param keys {Object} 对象key
 * @returns {Array} 转换结果
 */
exports.chineseKeyToEnglish = (data, keys) => {
  return data.map(val => {
    return _.mapKeys(val, (value, key) => {
      return _.findLastKey(keys, (o) => {
        return key === o;
      });
    });
  });
};

/**
 * 根据条件更新数据， 否则新增一条
 * @param Model {Array} 模型
 * @param value {Object} 需更新的值 or 新增的值
 * @param condition {Object} 条件
 * @returns {Array} 结果
 */
exports.upsert = async (Model, value, condition) => {
  const result = await Model.findOne({
    where: condition,
  });
  if (result) {
    return await result.update(value);
  } else {
    return await Model.create(value);
  }
};


/**
 * @description: 代理客户提供接口，错误处理和返回数据
 * @param {type} url: 接口地址
 * @param {type} isMock: 是否使用mock
 * @return: 实时数据
 */
exports.handleProxyReq = (url, isMock) => {
  // return new Promise((resolve, reject) => {
  return new Promise((resolve) => {
    if (isMock) {
      return resolve(0);
    } else {
      superagent.get(url)
      // .charset('gbk')  // 当前页面编码格式
      // .buffer(true)
        .end((err, data) => {
          if (err) {
            log.error('handleProxyReq', err);
            return reject(err);
          }
          return resolve(data);
        });
    }
  });
};

/**
 * @description: api天气等数据
 * @param {type} url: 三方接口地址
 * @param {type} isMock: 是否使用mock
 * @return: 实时数据
 */
exports.handleProxyReqReal = () => {
  const appid = '';
  // 神箭手api获取appid 参考 https://www.shenjian.io/index.php?r=api/dashboard&app_id=5837293
  const area = '杭州';
  const now = true;
  let realtimeUrl = `https://api.shenjian.io/weather/area/?appid=${appid}&area=${encodeURIComponent(area)}&only_now=${now}`;
  return new Promise((resolve, reject) => {
    superagent.get(realtimeUrl)
      .end((err, data) => {
        if (err) {
          log.error('handleProxyReqReal', err);
          return reject(err);
        }
        if (data.error_code) {
          log.error('handleProxyReqReal_data_error', data.reason);
          return reject(data.reason);
        }
        return resolve(JSON.parse(data.text));
      });
  });
};

/**
 * @description: 三方扒取天气等数据
 * 实时pm2.5 CO2
 * co2暂时无法找到，需要调整需求，SO2或者NO2或者CO
 * http://tianqi.2345.com/air-71937.htm
 *
 * @param {type} url: 三方接口地址
 * @param {type} isMock: 是否使用mock
 * @return: 实时数据
 */
exports.handleProxyReqPM = () => {
  const crawlUrl = 'http://tianqi.2345.com/air-71230.htm';
  return new Promise((resolve, reject) => {
    superagent.get(crawlUrl).charset('gbk')
      .buffer(true)
      .end(async (err, data) => {
        if (err) {
          log.error('handleProxyReqPM', err);
          return reject(err);
        }
        let html = data.text;
        let $ = cheerio.load(html, {
          decodeEntities: false,
          ignoreWhitespace: false,
          xmlMode: false,
          lowerCaseTags: false,
        });
        const pm25 = parseInt($('#name-pm2-5 .value').text().substr(0, 2));
        const pm10 = parseInt($('#name-pm10 .value').text().substr(0, 2));
        return resolve({
          pm25: pm25,
          pm10: pm10,
        });
      });
  });
};
