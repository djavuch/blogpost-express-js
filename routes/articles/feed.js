const express = require('express')
const articlesFeedRouter = express.Router()

const ArticleController = require('../../controllers/articles/ArticleController')

articlesFeedRouter
  .get('/:articleSlug', ArticleController.getArticle)
  .get('/', ArticleController.getAllArticles)

module.exports = articlesFeedRouter