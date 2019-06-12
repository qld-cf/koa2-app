'use strict';

const errorCode = require('./error_code'); // eslint-disable-line

// 系统自自定义错误
class SysError extends Error {
  constructor(message, errorCode = errorCode.ERROR_UNKNOWN, content, status = 200) {
    super(message);
    this.code = errorCode;
    this.status = status;
    this.content = content;
  }
}

module.exports = SysError;
