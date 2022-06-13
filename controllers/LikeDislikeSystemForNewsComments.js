const Comment = require("../models/comment")

// Like
exports.giveLike = function (req, res) {
    Comment.findById(req.params.id).exec(function(err, comment) {
        comment.likes.push(req.user._id)
        comment.likeScore += 1 
        comment.save()
        res.status(200)
    })
}

exports.giveDislike = function(req, res) {
    Comment.findById(req.params.id).exec(function(err, comment) {
        comment.dislikes.push(req.user._id)
        comment.likeScore -= 1 
        comment.save()
        res.status(200)
    })
}
