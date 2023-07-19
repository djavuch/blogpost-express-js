const express = require('express')
const router = express.Router()

// Require controllers
const adminNewsRouter = require('./news'),
  adminMewsCategoriesRouter = require('./categories'),
  adminArticlesRouter = require('./articles'),
  adminUsersRouter = require('./users')

// Main page
router.get('/', (req, res) => {
  res.render('admin/index', {
    title: 'Admin Panel'
  })
})

router
  .use('/news', adminNewsRouter)
  .use('/news-categories', adminMewsCategoriesRouter)
  .use('/articles', adminArticlesRouter)
  .use('/users', adminUsersRouter)

router.get('/bootstrap-components', (req, res) => {
  res.render('admin/bootstrap-components', {
    title: 'Components'
  })
})

module.exports = router