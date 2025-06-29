const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('User', {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number(),
  particularity: Joi.string(),
  role: Joi.string().required(),
  photoUrl: Joi.string(),
})
