const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../../utils/autopopulate')
const ArticleComments = require('./../articles/ArticleCommentsModel')

const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

// Article  Schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArticleComment'
  }]
},
  {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  }
})

articleSchema
  .pre('findOne', Populate('author'))
  .pre('find', Populate('author'))
  // Delete article with comments
  .pre('remove', async function (next) {
    await ArticleComments.remove({
      "_id": {
        $in: this.comments
      }
    })
    next()
  })

  .pre('validate', function () {
    if (this.title) {
      this.slug = slugify(this.title, {
        lower: true, strict: true
      })
    }
    if (this.text) {
      this.text = dompurify.sanitize(this.text)
    }
  })

articleSchema.methods.incrementViewsCounter = function incrementViewsCounter() {
  const article = this
  article.views += 1
  article.save()
}

articleSchema.index({ title: 'text', description: 'text' })

module.exports = mongoose.model('Article', articleSchema)
