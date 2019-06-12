const db = require('../model');

// 查询
exports.mobileBrand = async (name) => {
  return await db.MobileBrand.findAll({
    where: {
      name: name,
    },
  });
};


