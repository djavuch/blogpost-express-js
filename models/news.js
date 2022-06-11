const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../utils/autopopulate')
const mongoosePaginate = require('mongoose-paginate-v2')
const Comment = require('../models/comment')

const newsSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    body: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, 
    {   
        timestamps: {
        createdAt: 'created_on', updatedAt: 'updated_on'
    }
})

newsSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author')) 
    // Delete comments with news
    .pre('remove', async function(next) {
        await Comment.remove({
            "_id" : {
                $in: this.comments
            }
        })
        next()
    })

newsSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('News', newsSchema)