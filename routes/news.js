const express = require('express')
const router = express.Router()

// Require middleware
const { roleAuthorization } = require('../middleware/authorization')

// Require controlles
const NewsController = require('../controllers/news/NewsController')
const NewsCommentsController = require('../controllers/news/NewsCommentsController')


/// NEWS ROUTES ///

// News by category
router.get('/:category_slug', NewsController.groupNewsByCategory)

//Newswire
router.get('/newswire', NewsController.newswireForBlog)

// News core section
router.get('/:category_slug/:news_slug', NewsController.getNews)

// News comment section
router.post('/:newsId/comments', NewsCommentsController.addComment)

// Edit news comments
router.post('/comments/edit/:id',  NewsCommentsController.editComment )

// Delete comments
router.delete('/:id/comments/:id', NewsCommentsController.deleteComment)

module.exports = router