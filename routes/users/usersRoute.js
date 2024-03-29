const express = require('express')
const router = express.Router()

router.use(
  require('./auth'),
  require('./recovery'),
  require('./profile')
)

module.exports = router