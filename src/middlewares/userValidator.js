const Joi = require('joi');

const validateUserRegistration = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.base': 'O nome deve ser uma string.',
                'string.empty': 'O nome é obrigatório.',
                'string.min': 'O nome deve ter no mínimo 3 caracteres.',
                'string.max': 'O nome deve ter no máximo 30 caracteres.'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Insira um e-mail válido.',
                'string.empty': 'O e-mail é obrigatório.'
            }),
        password: Joi.string()
            .min(8)
            .required()
            .messages({
                'string.empty': 'A senha é obrigatória.',
                'string.min': 'A senha deve ter no mínimo 8 caracteres.'
            }),
        confirmPassword: Joi.any()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'As senhas não coincidem.',
                'any.required': 'A confirmação da senha é obrigatória.'
            }),
        role: Joi.string()
            .valid('admin', 'organizer', 'participant')
            .messages({
                'string.valid': 'O papel deve ser admin, organizer, ou participant.',
            }),
        profile_picture: Joi.string()
            .uri()
            .optional()
            .messages({
                'string.uri': 'A URL da imagem de perfil deve ser válida.'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
}

const validateUserLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Insira um e-mail válido.',
                'string.empty': 'O e-mail é obrigatório'
            }),
        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'A senha é obrigatória',
                'string.min': 'A senha deve ter no mínimo 8 caracteres'
            }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin
}
