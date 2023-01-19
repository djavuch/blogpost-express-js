const express = require('express')
const mainRoute = express.Router()
const Article = require('../models/article')
const News = require('../models/news')
const NewsCategory = require('../models/NewsCategory')

const getCategories = () => {
    return NewsCategory.find()
}

mainRoute.get('/', async (req, res) => {
    const newsPerPage = 7
    const articlesPerPage = 7
    const categories = await getCategories()
    News.find({}).sort({created_on: -1}).limit(newsPerPage).then(newswire => {
        Article.find({}).limit(articlesPerPage).then((articles) => {
            res.render('index', {
                title: 'Main',
                newswire, categories, articles
            })
        })
    })
})

module.exports = mainRoute