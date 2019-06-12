/*
 * @Description: 日志封装
 * @Author: your name
 * @Date: 2019-05-13 14:21:08
 * @LastEditTime: 2019-06-12 16:18:44
 * @LastEditor: Please set LastEditors
 */

'use strict';

const DailyRotateFile = require('winston-daily-rotate-file');
const {createLogger, transports, format} = require('winston');

const config = require('../config');
const {combine, timestamp, printf} = format;

let _transports = null;
if (!config.debug) {
  _transports = [new DailyRotateFile(config.logger.prd)];
} else {
  _transports = [new transports.Console(config.logger.dev)];
}

const logger = createLogger({
  transports: _transports,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss:SSS',
    }),
    printf(info => {
      const {level, message, timestamp} = info;
      let splatInfo = info[Symbol.for('splat')];
      if (level.indexOf('error') !== -1) {
        console.error(info.timestamp, message, splatInfo ? splatInfo : ''); // eslint-disable-line
      }
      let more = [message];
      if (splatInfo) {
        splatInfo.forEach(item => {
          if (item instanceof Error) {
            more.push(item.message);
          } else if (item instanceof Buffer) {
            more.push(item);
          } else if (typeof item === 'object') {
            more.push(JSON.stringify(item));
          } else {
            more.push(item);
          }
        });
      }
      return `[${timestamp}] - [${level}] - [${process.pid}]: ${ more.join(' ')}`;
    })
  ),
});

module.exports = logger;
