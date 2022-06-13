const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../utils/autopopulate')

const commentSchema = new mongoose.Schema({
    author: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    commentText: {
        type: String
    },
    datePosted: {
        type: Date,
        default: Date.now()
    },
    newsId: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    likeScore: {
        type: Number
    }
}, 
    {   
        timestamps: {
            createdAt: 'created_on', updatedAt: 'updated_on'
    }
})

commentSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model('Comment', commentSchema)