const express = require('express')
const router = express.Router()

// Require middleware
const { roleAuthorization } = require('../middleware/authorization')

// Require controlles
const NewsController = require('../controllers/news/NewsController')
const NewsCommentsController = require('../controllers/news/NewsCommentsController')


/// NEWS ROUTES ///

// News by category
router.get('/categories/:category_slug', NewsController.groupNewsByCategory)

//Newswire
router.get('/newswire', NewsController.newswireForBlog)

// News core section
router.get('/:news_slug', NewsController.getNews)

// News comment section
router.post('/:newsId/comments', NewsCommentsController.addComment)

// Edit news comments
router.post('/:newsId/comments/edit/:id',  NewsCommentsController.editComment )

// Delete comments
router.delete('/:newsId/comments/:id', NewsCommentsController.deleteComment)

module.exports = router