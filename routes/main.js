const express = require('express')
const mainRoute = express.Router()

const MainRoute = require('../controllers/MainRoute')
const {mainRouteNewsArticles} = require("../controllers/MainRoute");

mainRoute.get('/', MainRoute.mainRouteNewsArticles)

module.exports = mainRoute