const NewsComment = require('../../models/news/NewsCommentsModel')
const NewsPost = require('../../models/news/NewsPostModel')

// Add comment
exports.addComment = async (req, res) => {
  try {
    const newsid = req.params.newsId

    const news = await NewsPost.findOne({ _id: newsid })

    if (!news) {
      req.flash('danger', 'News not found')
      return res.redirect(404)
    }

    const newsComment = new NewsComment({
      commentText: req.body.commentText,
      author: req.user._id,
      newsId: newsid
    })

    if (req.body.parentCommentId) {
      newsComment.parentComment = req.body.parentCommentId
    }

    const createComment = await newsComment.save()

    news.comments.push(createComment._id)

    await news.save()

    res.redirect(`/news/${news.slug}`)
  } catch (err) {
    console.log(err)
  }
}

// Edit comment
exports.editComment = async (req, res, next) => {
  try {
    const newsid = req.params.newsId

    const { user } = req

    const news = await NewsPost.findOne({ _id: newsid })
    if (!news) {
      req.flash('danger', 'News not found')
      return res.redirect(404)
    }
    const { commentText } = req.body

    const commentId = { _id: req.params.commentId }

    if(!commentId.author  && user.role !== 'admin' && user.role !== 'moderator') {
      req.flash('warning', 'You do not have permission to do this action.')
      return res.redirect('back')
    }

    NewsComment.findByIdAndUpdate(commentId, { commentText }, (err, updatedComment) => {
      if (err) {
        console.log(err)
      } else {
        console.log(updatedComment)
        res.redirect(`/news/${news.slug}`)
      }
    })
  } catch (err) {
    next(err)
  }
}

// Delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    // Find comment in DB
    const newsComment = await NewsComment.findOne({ _id: req.params.commentId })

    if (!newsComment) {
      return res.status(404)
    }

    if(!newsComment.author  && user.role !== 'admin' && user.role !== 'moderator') {
      req.flash('warning', 'You do not have permission to do this action.')
      return res.redirect('back')
    }

    newsComment.remove()

    // Remove comment from news body
    const news = await NewsPost.findByIdAndUpdate({ _id: newsComment.newsId },
      {
        $pull: { comments: req.params.commentId }
      }
    ).exec()

    if (!news) {
      return res.status(404)
    }

    news.save()

    return res.redirect(`/news/${news.slug}`)
  } catch (error) {
    next(error)
  }
}