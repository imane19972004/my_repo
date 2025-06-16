const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

const itemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').required(),
  imagePath: Joi.string().allow('').optional(),
  category: Joi.string().required(),
})

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  imagePath: Joi.string().allow('').optional(),
})

module.exports = new BaseModel('UserExerciseList', {
  userId: Joi.string().required(),
  userExerciceList: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      theme: Joi.string().required(),
      description: Joi.string().allow('').required(),
      categories: Joi.array().items(categorySchema).required(),
      items: Joi.array().items(itemSchema).required(),
    })
  ).required(),
})
