const express = require('express')
const router = express.Router()

// Require controllers
const newsRouter = require('../routes/admin/news'),
  newsCategoriesRouter = require('../routes/admin/categories')

const AdminArticles = require('../controllers/admin/AdminArticles')
const AdminUsers = require('../controllers/admin/AdminUsers')

// Main page
router.get('/', (req, res) => {
  res.render('admin/index', {
    title: 'Admin Panel'
  })
})

router
  .use('/news', newsRouter)
  .use('/news-categories', newsCategoriesRouter)


/*****************************
 ****** Articles section ******
 ******************************/

router.get('/articles', AdminArticles.listOfArticles)

router.get('/articles/add', AdminArticles.addArticleView)

router.post('/articles/add', AdminArticles.addArticle)

router.get('/articles/edit/:id', AdminArticles.editArticleView)

router.post('/articles/edit/:id', AdminArticles.editArticle)

router.delete('/articles/:id', AdminArticles.deleteArticle)

/*****************************
 ******* Users section ********
 ******************************/

router.get('/users', AdminUsers.listOfUsers)

router.get('/bootstrap-components', (req, res) => {
  res.render('admin/bootstrap-components', {
    title: 'Components'
  })
})

module.exports = router