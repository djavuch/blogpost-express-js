const { validationResult, body } = require('express-validator')
const { promisify } = require('util')
const User = require("../models/users/UserModel");

exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash('error', errors.array({
      onlyFirstError: true
    })[0].msg)
    return res.redirect('back')
  }
  next()
}

exports.newsCreateValidator = [
  body('title')
    .notEmpty()
    .bail()
    .withMessage('Title is not empty.'),
  body('category')
    .notEmpty()
    .bail()
    .withMessage('Choose category.'),
  body('text')
    .notEmpty()
    .bail()
    .withMessage('News is not empty.'),
  body('previewImage')
    .bail()
    .custom((value, {req, path}) => {
      if (!req.file) {
        throw new Error('Preview image is required.')
      }
      return true
    })
]

exports.newsEditValidator = [
  body('title')
    .notEmpty()
    .bail()
    .withMessage('Title is not empty.'),
  body('category')
    .notEmpty()
    .bail()
    .withMessage('Choose category.'),
  body('text')
    .notEmpty()
    .bail()
    .withMessage('News is not empty.')
]

exports.userValidator = [
  body('name')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Name is not empty.'),
  body('username')
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Username is not empty.'),
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
    })
]

exports.categoriesValidator = [
  body('name')
    .notEmpty()
    .bail()
    .withMessage('Name is not entry.')
]
