const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Article = require('../models/article')
const { User } = require('../models/user')

//Add Route
router.get('/add', (req, res) => res.render('add_article', {
    title: 'Add Article'
}))

//Add Submit POST
router.post('/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save(function(err) {
        if(err){
            console.log(err)
            return
        } else {
            req.flash('success', 'Article added')
            res.redirect('/')
        }
    })
})

//Load Edit Page
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article:article
        })
    })
})

// Edit Article
router.post('/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    let query = {_id:req.params.id}

    Article.updateOne(query, article, function(err) {
        if(err){
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
})

// Delete Article
router.delete('/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//Get single Article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article: article
        })
    })
})

module.exports = router