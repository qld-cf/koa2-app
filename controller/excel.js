const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const util = require('../common/util');
const {
  MobileBrand,
} = require('../model');

// excel分析结果保存到数据库
const MoblieBrand = async (data) => {
  const keys = {
    name: '手机品牌',
    rank: '排行榜',
  };
  const results = util.chineseKeyToEnglish(data, keys);
  for (let result of results) {
    await util.upsert(MobileBrand, result, {
      name: result.name,
    });
  }
};

// 上传并解析excel
exports.readExcel = async (path, name) => {
  const work = xlsx.readFile(path, { cellDates: true });
  const SheetNames = work.SheetNames;
  for (let SheetName of SheetNames) {
    let worksheet = work.Sheets[SheetName];
    let result = xlsx.utils.sheet_to_json(worksheet);
    if (SheetName === '手机品牌') {
      await MoblieBrand(result);
    }
  }
  fs.renameSync(path, `upload/mobile/${moment().format('YYYY-MM-DD HH-mm-ss')}_${name}`);
  return '解析成功';
};