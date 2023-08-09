const express = require('express')
const router = express.Router()

router.use(
  require('./newswire'), // news core
  require('./comments')) // news comments

module.exports = router