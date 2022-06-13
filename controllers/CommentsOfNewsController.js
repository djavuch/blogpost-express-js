const Comment = require("../models/comment")
const News = require("../models/news")

// Add comment
exports.addComment = async function (req, res) {
    const newsComment = new Comment(req.body)
    newsComment.author = req.user._id
    newsComment.newsId = req.params.id

    newsComment.likes = []
    newsComment.dislikes = []
    newsComment.likeScore = 0

    if (req.body.parentId) {
        newsComment.parentCommentId = req.body.parentId
    }

    await newsComment.save(function(err, data) {
        if (err) {
            console.log(err)
        }
        News.findOneAndUpdate({_id: req.params.id}, {$addToSet: {comments: {_id: data._id}}}, function(err) {
            if(err) {
                console.log(err)
            }
            res.redirect(`/news/${req.params.id}`)
        })
    })
}

// Delete comments
exports.deleteComment = function (req, res) {
    Comment.findOne({ _id: req.params.id }).exec(function(err, comment) {
        comment.remove(function(err) {
            if (err) {
                console.log(err)
            }
        })
        News.findByIdAndUpdate({ _id: comment.newsId }, { $pull: { comments: req.params.id }}).exec(function(err, news) {
            if (err) {
                console.log(err)
                res.sendStatus(400)
            }
            res.redirect('/')
        })
    })
}