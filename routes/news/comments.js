const express = require('express')
const newsCommentsRouter = express.Router()

const NewsCommentsController = require('../../controllers/news/NewsCommentsController')

newsCommentsRouter.post('/:newsId/send', NewsCommentsController.addComment) // add comment to news
  .put('/:newsId/comments/:commentId/edit', NewsCommentsController.editComment ) // edit news comment
  .delete('/:newsId/comments/:commentId', NewsCommentsController.deleteComment) // delete news comment

module.exports = newsCommentsRouter