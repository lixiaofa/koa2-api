const Joi = require('joi');

const schema = Joi.object().keys({
    type: Joi.string().min(3).max(16).required(),
    income: Joi.string().required(),
    expend: Joi.string().required(),
    cash: Joi.string().required()
})

module.exports = ProfileJoi = schema