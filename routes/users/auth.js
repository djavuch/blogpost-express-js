const express = require('express')
const authUsersRouter = express.Router()

const AuthController = require('../../controllers/users/AuthController')
// Require fields validations
const validations = require('../../utils/public-validators')

authUsersRouter
  // Register
  .get('/signup',
  AuthController.signupView
  )
  .post('/signup',
    validations.registerValidator,
    validations.handleValidation,
    AuthController.signupOnPost
  )
  // Confirm register
  .get('/confirm/:userId/:token',
    AuthController.verifyAccount
  )
  // Authentication
  .post('/signin',
    validations.singInValidator,
    validations.handleValidation,
    AuthController.signin
  )
  .get('/logout',
    AuthController.logout
  )

module.exports = authUsersRouter