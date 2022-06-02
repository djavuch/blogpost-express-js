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
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now()
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, 
    {   
        timestamps: {
        createdAt: 'created_on', updatedAt: 'updated_on'
    }
})

commentSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))
    .pre('findOne', Populate('replies'))
    .pre('find', Populate('replies'))

module.exports = mongoose.model('Comment', commentSchema)