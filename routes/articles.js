const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Article = require('../models/article')
const User = require('../models/user')
// const Comment = require('../models/comment')

// Require controlles
const ArticleController = require('../controllers/articles/ArticleController')
// const CommentsOfNewsController = require('../controllers/CommentsOfNewsController')

//ArticleWire Controller
// const NewsArchive = require('../controllers/NewsArchive')

/// Article ROUTES ///

// Articlewire
// router.get('/newswire', NewsArchive.newswireForBlog)

// Articles core section
router.get('/add', ArticleController.getAddArticle)
router.post('/add', ArticleController.addArticle)
router.get('/edit/:id', ArticleController.getEditArticle)
router.post('/edit/:id', ArticleController.editArticle)
router.delete('/:id', ArticleController.deleteArticle)
router.get('/:id', ArticleController.getArticle)

// Articles comment section
// router.post('/:id/comments', CommentsOfNewsController.addComment)

//Replies
// router.post('/:newsId/comments/:commentId/reply', CommentsOfNewsController.postReplyToComment)

module.exports = router