const Joi = require('joi')

const schema = Joi.object().keys({
    name: Joi.string().min(3).max(16).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,16}$/),
    role: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 })
})
//.with('username', 'birthyear')

module.exports = UserJoi = schema