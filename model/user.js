const {Sequelize, pool} = require('../common/mysql');

const User = pool.define('koa_user', {
  // 管理员密码
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

User.sync();

User.upsert({
  password: 'e10adc3949ba59abbe56e057f20f883e',
});
module.exports = User;