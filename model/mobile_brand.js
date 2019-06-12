const {Sequelize, pool} = require('../common/mysql');

const MobileBrand = pool.define('koa_mobile_brand', {
  // 排行榜
  rank: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  // 名称
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  // 启用时间
  timestamps: true,
  // 创建时间
  createdAt: 'ctime',
  // 修改时间
  updatedAt: 'mtime',
  // 表注释
  comment: '手机品牌表',
});

MobileBrand.sync();

module.exports = MobileBrand;