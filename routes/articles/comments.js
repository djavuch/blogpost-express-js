const express = require('express')
const articlesCommentsRouter = express.Router()

const ArticlesComments = require('../../controllers/articles/ArticleCommentController')

articlesCommentsRouter
  .post('/:articleId/comments/send', ArticlesComments.addComment)
  .put('/:articleId/comments/:commentId/edit', ArticlesComments.editArticleComment)
  .delete('/:articleId/comments/:commentId', ArticlesComments.deleteArticleComment)

module.exports = articlesCommentsRouter