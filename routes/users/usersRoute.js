const express = require('express')
const router = express.Router()

const authUsersRouter = require('./auth')
  recoveryRouter = require('./recovery')
  userProfilesRouter = require('./profile')

router.use(
  authUsersRouter,
  recoveryRouter,
  userProfilesRouter
)

module.exports = router