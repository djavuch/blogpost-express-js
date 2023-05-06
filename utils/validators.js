const { body } = require('express-validator')
const User = require('../models/user')

module.exports = {
  registerValidator: [
    body('name')
      .notEmpty()
      .withMessage('Name is not empty'),
    body('username')
      .notEmpty()
      .withMessage('Username is not empty'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .toLowerCase()
      .withMessage('Check if your email is correct')
      .custom((value) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
           return Promise.reject('Email is already taken!')
          }
        })
      }),
    body('password')
      .trim()
      .isLength(6)
      .withMessage('Password length short, min 6 char required'),
    body('password2').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password do not match')
      }
      return true
    })
  ],
  singInValidator: [
    body('username')
      .notEmpty()
      .withMessage('Please enter your username'),
    body('password')
      .notEmpty()
      .withMessage('You need enter password')
  ]
}