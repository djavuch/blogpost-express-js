const mongoose = require('mongoose')
const Populate = require('../../utils/autopopulate')
const Comment = require('./../news/NewsCommentsModel')

const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const fs = require("fs");
const path = require("path");
const dompurify = createDomPurify(new JSDOM().window)

const newsPostSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  previewImage: {
    type: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
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
  },
  isTopNews: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_on', updatedAt: 'updated_on'
  }
})

newsPostSchema
  .pre('findOne', Populate('author'))
  .pre('find', Populate('author'))
  .pre('findOne', Populate('category'))
  .pre('find', Populate('category'))
  // Delete comments with news
  .pre('remove', async function (next) {
    await Comment.remove({
      "_id": {
        $in: this.comments
      }
    })
    next()
  })
  // Convert title to url slug
  .pre('validate', function () {
    if (this.title) {
      this.slug = slugify(this.title, {
        lower: true, strict: true
      })
    }
    if (this.body) {
      this.body = dompurify.sanitize(this.body)
    }
  })

newsPostSchema.methods.incrementViewsCounter = function incrementViewsCounter() {
  const news = this
  news.views += 1
  news.save()
}

newsPostSchema.methods.removeImagesWithPost = function removeImagesWithPost() {
  try {
    fs.existsSync(path.join(__dirname, '../../', this.previewImage))
    fs.unlinkSync(path.join(__dirname, '../../', this.previewImage))
  } catch (err) {
    console.log(err)
  }
}

module.exports = mongoose.model('NewsPost', newsPostSchema)