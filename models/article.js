const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../utils/autopopulate')
const mongoosePaginate = require('mongoose-paginate-v2')

//Article  Schema
const articleSchema = mongoose.Schema({
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
    articleComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, 
    {   
        timestamps: {
        createdAt: 'created_on', updatedAt: 'updated_on'
    }
})

articleSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

articleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Article', articleSchema)
