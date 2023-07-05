const { body } = require('express-validator')
const User = require('../models/users/UserModel')

module.exports = {
  registerValidator: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is not empty'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is not empty'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .toLowerCase()
      .withMessage('Check if your email is correct')
      .custom((email) => {
        return User.findOne({ email: email }).then(user => {
          if (user) {
           return Promise.reject('Email is taken!')
          }
        })
      }),
    body('password')
      .trim()
      .isLength(6)
      .withMessage('Password length short, minimum 6 char required'),
    body('password2')
      .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password do not match.')
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
  ],
  resetPwdValidator: [
    body('email')
      .notEmpty()
      .withMessage('Check if your email is correct.')
      .custom((email) => {
        return User.findOne({ email: email }).then(user => {
          if (!user) {
            return Promise.reject('User with this email is not registered!')
          }
        })
      })
  ],
  newPwdValidator: [
    body('password')
      .trim()
      .isLength(6)
      .withMessage('Password length short, minimum 6 char required'),
    body('password2').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password do not match')
      }
      return true
    })
  ]
}