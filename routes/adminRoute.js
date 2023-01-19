const express = require('express')
const router = express.Router()

// Require controlles
const AdminAuth = require('../controllers/admin/AdminAuth')
const AdminNews = require('../controllers/admin/AdminNews')
const AdminNewsCategories = require('../controllers/admin/AdminNewsCategories')
const AdminArticles = require('../controllers/admin/AdminArticles')
const AdminUsers = require('../controllers/admin/AdminUsers')

// Require middleware
const { roleAuthorization } = require('../middleware/authorization')

// Main page
router.get('/',  (req, res) => {
    res.render('admin/index', {
        title: 'Admin'
    })
})

// Auth routes
router.post('/auth', AdminAuth.authToAdminPanel)

router.get('/auth', AdminAuth.authToAdminPanelView)

/******************************
******** News section *********
******************************/

router.get('/news',  AdminNews.listOfNews)

router.get('/news/add',  AdminNews.addNewsView)

router.post('/news/add',  AdminNews.addNews)

router.get('/news/edit/:id',  AdminNews.editNewsView)

router.post('/news/edit/:id',  AdminNews.editNews)

router.delete('/news/:id',  AdminNews.deleteNews)

/******************************
*** News categories section ***
******************************/

router.get('/news-categories', AdminNewsCategories.listOfCategories)

router.get('/news-categories/add',  AdminNewsCategories.addNewsCategoryView)

router.post('/news-categories/add',  AdminNewsCategories.addNewsCategory)

router.get('/news-categories/edit',  AdminNewsCategories.editNewsCategoryView)

router.post('/news-categories/edit',  AdminNewsCategories.editNewsCategory)

router.delete('/news-categories/:category',  AdminNewsCategories.deleteNewsCategory)

/*****************************
****** Articles section ******
******************************/

router.get('/articles',  AdminArticles.listOfArticles)

router.get('/articles/add',  AdminArticles.addArticleView)

router.post('/articles/add',  AdminArticles.addArticle)

router.get('/articles/edit/:id',  AdminArticles.editArticleView)

router.post('/articles/edit/:id',  AdminArticles.editArticle)

router.delete('/articles/:id',  AdminArticles.deleteArticle)

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