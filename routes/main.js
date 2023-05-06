const express = require('express')
const mainRoute = express.Router()
const Article = require('../models/article')
const News = require('../models/news/NewsModel')


mainRoute.get('/', async (req, res) => {
    const newsPerPage = 7
    const articlesPerPage = 7
    News.find({}).sort({created_on: -1}).limit(newsPerPage).then(newswire => {
        Article.find({}).limit(articlesPerPage).then((articles) => {
            res.render('index', {
                title: 'Main',
                newswire, articles
            })
        })
    })
})

module.exports = mainRoute