const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../utils/autopopulate')
const mongoosePaginate = require('mongoose-paginate-v2')

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

newsSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('News', newsSchema)