const Article = require('../../models/articles/ArticleModel')
const ArticleComment = require('../../models/articles/ArticleCommentsModel')

// Add comment
// .post('/articles/:articleId/comments/send')
exports.addComment = async (req, res) => {
  try {
    const foundArticle = req.params.articleId

    const article = await Article.findOne({ _id: foundArticle })

    if (!article) {
      req.flash('danger', 'Article not found.')
      return res.redirect(404)
    }

    const articleComment = new ArticleComment({
      commentText: req.body.commentText,
      author: req.user._id,
      articleId: foundArticle
    })

    if (req.body.parentCommentId) {
      articleComment.parentComment = req.body.parentCommentId
    }

    await articleComment.save()

    article.comments.push(articleComment._id)

    await article.save()

    res.redirect(`/articles/${article.slug}`)
  } catch (err) {
    console.log(err)
  }
}

// .post('/:articleId/comments/:commentId/edit')
exports.editArticleComment = async (req, res) => {
  try {
    const foundArticle = req.params.articleId

    const article = await Article.findOne({ _id: foundArticle })

    if (!article) {
      req.flash('danger', 'Article not found.')
      return res.redirect(404)
    }

    const commentId = { _id: req.params.commentId }

    if(!commentId.author && req.user.role !== 'admin' && req.user.role !== 'moderator') {
      req.flash('warning', 'You do not have permission to do this action.')
      return res.redirect('back')
    }

    const { commentText } = req.body

    await ArticleComment.findOneAndUpdate(commentId, { commentText }, { new: true })

    return res.redirect(`/articles/${article.slug}`)
  } catch (err) {
    console.log(err)
  }
}

// .delete('/:articleId/comments/:commentId')
exports.deleteArticleComment = async (req, res) => {
  try {
    // find comment
    const commentId = { _id: req.params.commentId }


    const articleComment = await ArticleComment.findOne(commentId)


    if (!articleComment) {
      req.flash('danger', 'Comment not found.')
      return res.redirect(404)
    }

    if (!articleComment.author && req.user.role !== 'admin' && req.user.role !== 'moderator') {
      req.flash('warning', 'You do not have permission to do this action.')
      return res.redirect('back')
    }

    await articleComment.remove()

    // find comment linked to article
    const article = await Article.findByIdAndUpdate({ _id: articleComment.articleId }, {
      $pull:
        {
          comments: req.params.commentId
        }
    })

    if (!article) {
      req.flash('danger', 'Article not found.')
      return res.redirect('/')
    }

    await article.save()

    return res.redirect(`/articles/${article.slug}`)
  } catch (err) {
    console.log(err)
  }
}