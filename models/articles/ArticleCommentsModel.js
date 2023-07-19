const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Populate = require('../../utils/autopopulate')

const articleCommentSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commentText: {
    type: String
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'ArticleComment'
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
  // depth: {
  //   type: Number, default: 0
  // }
}, {
  timestamps: {
    createdAt: 'created_on', updatedAt: 'updated_on'
  }
})

articleCommentSchema
  .pre('findOne', Populate('author'))
  .pre('find', Populate('author'))

module.exports = mongoose.model('ArticleComment', articleCommentSchema)