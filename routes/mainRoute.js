const express = require('express')
const mainRoute = express.Router()

const MainRoute = require('../controllers/MainController')

mainRoute.get('/', MainRoute.mainRouteNewsArticles)
mainRoute.get('/search', MainRoute.searchOnSite)

module.exports = mainRoute