const express = require('express')
const router = express.Router()

router
  .use('/', require('./main')) // admin/main.js
  .use('/news',require('./news')) // admin/news.js
  .use('/news-categories', require('./categories')) // admin/categories.js
  .use('/articles', require('./articles')) // admin/articles.js
  .use('/users', require('./users')) // admin/users.js

module.exports = router