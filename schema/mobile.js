const Joi = require('joi');

const brandSchema = {
  query: {
    name: Joi.string().required(),
  },
};

module.exports = {
  brandSchema,
};
