const express = require('express')
const router = express.Router()

// Require middleware
const { roleAuthentication } = require('../middleware/authentication')

// Require controllers
const NewsController = require('../controllers/news/NewsController')
const NewsCommentsController = require('../controllers/news/NewsCommentsController')

/// NEWS ROUTES ///

// News by category
router.get('/categories/:category_slug', NewsController.getNewsByCategory)

// Newswire
router.get('/newswire', NewsController.getNewswire)

// News core section
router.get('/:news_slug', NewsController.getNews)

// News comment section
router.post('/:newsId/send', NewsCommentsController.addComment)

// Edit news comments
router.post('/:newsId/comments/edit/:id', roleAuthentication('admin', 'moderator'), NewsCommentsController.editComment )

// Delete comments
router.delete('/:newsId/comments/:id', roleAuthentication('admin', 'moderator'), NewsCommentsController.deleteComment)

module.exports = router