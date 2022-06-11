const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const News = require('../models/news')
const Comment = require('../models/comment')

// Require controlles
const NewsController = require('../controllers/NewsController')
const CommentsOfNewsController = require('../controllers/CommentsOfNewsController')

// Newswire Controller
const NewsArchive = require('../controllers/NewsArchive')

/// NEWS ROUTES ///

//Newswire
router.get('/newswire', NewsArchive.newswireForBlog)

// News core section
router.get('/add', NewsController.getAddNews)
router.post('/add', NewsController.addNews)
router.get('/edit/:id', NewsController.getEditNews)
router.post('/edit/:id', NewsController.editNews)
router.delete('/:id', NewsController.deleteNews)
router.get('/:id', NewsController.getNews)

// News comment section
router.post('/:id/comments', CommentsOfNewsController.addComment)

// Delete comments
router.delete('/:id/comments/:id', CommentsOfNewsController.deleteComment)

module.exports = router