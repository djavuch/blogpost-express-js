const express = require('express')
const recoveryRouter = express.Router()

const PwdController = require('../../controllers/users/PwdController')
const validations = require('../../utils/public-validators')

recoveryRouter
  .get('/password/forgot',
    PwdController.reqToChangePwdView
  )
  .post('/password/send',
    validations.resetPwdValidator,
    validations.handleValidation,
    PwdController.reqToChangePwd
  )
  .get('/reset-password/:userId/:token',
    PwdController.changePwdView
  )
  .post('/reset-password/:userId/:token',
    validations.newPwdValidator,
    validations.handleValidation,
    PwdController.changePwd
  )

module.exports = recoveryRouter