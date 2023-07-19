const express = require('express')
const adminArticlesRouter = express.Router()

const AdminArticles = require('../../controllers/admin/AdminArticlesController')

adminArticlesRouter
  .get('/', AdminArticles.getAllArticles)
  .get('/add', AdminArticles.addArticleView)
  .post('/add', AdminArticles.addArticle)
  .get('/edit/:articleId', AdminArticles.editArticleView)
  .put('/edit/:articleId', AdminArticles.editArticle)
  .delete('/:articleId', AdminArticles.deleteArticle)

module.exports = adminArticlesRouter