const Comment = require("../models/comment")
const news = require("../models/news")
const News = require("../models/news")

// Parent comment
exports.addComment = async function (req, res) {
    const comment = new Comment(req.body)
    comment.author = req.user._id
    console.log(req.user._id)

    comment.save()

    const newsRelated = await News.findById(req.params.id)

    newsRelated.comments.unshift(comment)

    await newsRelated.save(function(err) {
        if(err) {
            console.log(err)
        }
        res.redirect(`/news/${req.params.id}`)
    })


    // const comment = new Comment(req.body)
    // comment.author = req.user._id
    //     console.log(req.user._id)
    //     comment 
    //         .save()
    //         .then(() => {
    //             return Promise.all([
    //                 News.findById(req.params.id)
    //             ])
    //         })
    //         .then(([news]) => {
    //             news.comments.unshift(comment)
    //             return Promise.all([
    //                 news.save()
    //             ])
    //         })
    //         .then(news => {
    //             res.redirect(`/news/${req.params.id}`)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
}

// Child comment
exports.postReplyToComment = async function (req, res) {
    const reply = new Comment(req.body)
    reply.author = req.user._id
    // get news ID
    await News.findById(req.params.newsId)
    // save reply
    reply.save()
    // find parent comment in news
    const comment = await Comment.findById(req.params.commentId)
    // unshift reply to comment array
    comment.replies.unshift(reply._id)
    // save comment and redirect to target news
    await comment.save(function(err) {
        if (err) {
            console.log(err)
        }
        res.redirect(`/news/${req.params.newsId}`)
    })

    // const reply = new Comment(req.body)
    // reply.author = req.user._id
    // // LOOKUP THE PARENT POST
    // News.findById(req.params.newsId)
    //     .then(news => {
    //         // FIND THE CHILD COMMENT
    //         Promise.all([
    //             reply.save(),
    //             Comment.findById(req.params.commentId)
    //         ])
    //             .then(([reply, comment]) => {
    //                 // ADD THE REPLY
    //                 comment.replies.unshift(reply._id)
    //                 return Promise.all([
    //                     comment.save()
    //                 ])
    //             })
    //             .then(() => {
    //                 res.redirect(`/news/${req.params.newsId}`)
    //             })
    //             .catch(console.error)
    //     })
}

// Delete comments
exports.deleteComment = function (req, res) {
    News.findByIdAndUpdate(
        req.params.id, { $pull: { "newsComments.comment": { _id: req.params.commentId } } }, { safe: true, upsert: true },
        function(err, comment) {
            if (err) { 
                return handleError(res, err); 
            }
            return res.redirect('/')
        })
}