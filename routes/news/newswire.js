const express = require('express')
const newswireRouter = express.Router()

const NewsController = require('../../controllers/news/NewsController')

newswireRouter
  .get('/categories/:category_slug', NewsController.getNewsByCategory) // news by category
  .get('/newswire', NewsController.getNewswire) // all news
  .get('/:news_slug', NewsController.getNews) // single news
  .get('/archive/:year/:month', NewsController.getNewsByMonth) // news by month and year

module.exports = newswireRouter