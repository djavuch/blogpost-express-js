const express = require('express')
const router = express.Router()

// Require controlles
const ArticleController = require('../controllers/articles/ArticleController')


/// Article ROUTES ///

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