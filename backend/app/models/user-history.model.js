const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('UserHistory', {
  userId: Joi.string(),
  exerciceId: Joi.string().required(),
  date: Joi.string().required(),
  exerciceName: Joi.string().required(),
  success: Joi.number().required(),
  failure: Joi.number().required(),
  itemFailures: Joi.object().pattern(Joi.string(), Joi.number()),
})
