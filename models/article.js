const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

//Article  Schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

articleSchema.plugin(mongoosePaginate)

let Article = module.exports = mongoose.model('Article', articleSchema)
// const Article = mongoose.model('Article', articleSchema)
// module.exports.Article = Article