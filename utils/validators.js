const { body } = require('express-validator')

module.exports = {
    registerValidator: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Check if your email is correct')
            .normalizeEmail()
            .toLowerCase(),
        body('password')
            .trim()
            .isLength(6)
            .withMessage('Password length short, min 6 char required'),
        body('password2').custom(( value, { req }) => {
            if(value !== req.body.password) {
                throw new Error('Password do not match')
            }
            return true
        })
    ]
}