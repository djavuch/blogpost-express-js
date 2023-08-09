const express = require('express')
const router = express.Router()

router.use(
  require('./feed'), // articles/feed.js
  require('./comments')) // articles/comments.js

module.exports = router