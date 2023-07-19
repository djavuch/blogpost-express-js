const express = require('express')
const router = express.Router()

// Require controllers
const ArticleController = require('../controllers/articles/ArticleController')
const ArticlesComments = require('../controllers/articles/ArticleCommentController')


/// Article ROUTES ///

// Articles core section
// router.get('/add', ArticleController.getAddArticle)
// router.post('/add', ArticleController.addArticle)
// router.get('/edit/:id', ArticleController.getEditArticle)
// router.post('/edit/:id', ArticleController.editArticle)
// router.delete('/:id', ArticleController.deleteArticle)
router.get('/:articleSlug', ArticleController.getArticle)
router.get('/', ArticleController.getAllArticles)

// Articles comment section
router.post('/:articleId/comments/send', ArticlesComments.addComment)
router.put('/:articleId/comments/:commentId/edit', ArticlesComments.editArticleComment)
router.delete('/:articleId/comments/:commentId', ArticlesComments.deleteArticleComment)


module.exports = router