const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../../utils/autopopulate')

const newsCommentSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  commentText: {
    type: String
  },
  newsId: {
    type: Schema.Types.ObjectId,
    ref: 'NewsPost',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'NewsComment'
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
  },

},
  {
  timestamps: {
    createdAt: 'created_on', updatedAt: 'updated_on'
  }
})

newsCommentSchema
  .pre('findOne', Populate('author'))
  .pre('find', Populate('author'))

module.exports = mongoose.model('NewsComment', newsCommentSchema)