const Comment = require("../../models/comment")
const News = require("../../models/news/NewsModel")

// Add comment
exports.addComment = async (req, res, next) => {
    try {
        const newsid = req.params.newsId

        const news = await News.findOne({ _id: newsid })
        if(!news) {
            req.flash('danger', 'News not found')
            return res.redirect(404)
        }
        
        const comment = new Comment({
            commentText: req.body.commentText,
            author: req.user._id,
            newsId: newsid
        }) 

        if (req.body.parentCommentId) {
            comment.parentComment = req.body.parentCommentId
        }

        const createComment = await comment.save()

        news.comments.push(createComment._id)

        await news.save()

        res.redirect(`/news/${news.slug}`)
    } catch (err) {
        next(err)
    }
}

// Edit comment
exports.editComment = async (req, res, next) => {
    try {
        const newsid = req.params.newsId

        const news = await News.findOne({_id: newsid})
        if(!news) {
            req.flash('danger', 'News not found')
            return res.redirect(404)
        }
        const { commentText } = req.body
    
        Comment.findByIdAndUpdate(req.params.id, { commentText }, (err, updatedComment) => {
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
        const comment = await Comment.findOne({ _id: req.params.id })
        if(!comment) {
            return res.status(404)
        }
        comment.remove()

        // Remove comment from news body
        const news = await News.findByIdAndUpdate({ _id: comment.newsId }, 
            {
                $pull: { comments: req.params.id }
            }
        ).exec()

        if(!news) {
            return res.status(404)
        }

        news.save()

        return res.redirect(`/news/${news.slug}`)
    } catch (error) {
        next(error)
    }
}