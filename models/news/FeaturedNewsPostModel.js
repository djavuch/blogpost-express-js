const mongoose = require('mongoose')

const featuredNewsSchema = new mongoose.Schema({
  newsId: {
    type: Schema.Types.ObjectId,
    ref: 'NewsPost'
  },
  isTopNews: {
    type: Boolean,
    default: false
  },
  isMostCommentedNews: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('FeaturedNews', featuredNewsSchema)