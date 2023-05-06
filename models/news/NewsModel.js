const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../../utils/autopopulate')
const mongoosePaginate = require('mongoose-paginate-v2')
const Comment = require('../comment')

const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const newsSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'newsCategory',
        required: [true, 'Select a category']
    }, 
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
    }],
    slug: {
        type: String, 
        required: true,
        unique: true
    },
    views: {
        type: Number,
        default: 0
    }
}, 
    {   
        timestamps: {
        createdAt: 'created_on', updatedAt: 'updated_on'
    }
})

newsSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author')) 
    .pre('findOne', Populate('category'))
    .pre('find', Populate('category')) 
    // Delete comments with news
    .pre('remove', async function(next) {
        await Comment.remove({
            "_id" : {
                $in: this.comments
            }
        })
        next()
    })
    // Convert title to url slug
    .pre('validate', function() {
        if(this.title) {
            this.slug = slugify(this.title, {
                lower: true, strict: true
            })
        }

        if (this.body) {
            this.body = dompurify.sanitize(this.body)
        }
    })

newsSchema.methods.incrementViewsCounter = function incrementViewsCounter() {
    const news = this
    news.views += 1
    news.save()
}

newsSchema.plugin(mongoosePaginate)


module.exports = mongoose.model('News', newsSchema)