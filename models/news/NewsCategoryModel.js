const mongoose = require('mongoose')
const slugify = require('slugify')

const newsCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the category name'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: {
    createdAt: 'created_on', updatedAt: 'updated_on'
  }
})

newsCategorySchema.pre('validate', function(next) {
  if(this.name) {
    this.slug = slugify(this.name, { lower: true,
      strict: true })
  }
  next()
})

module.exports = mongoose.model('newsCategory', newsCategorySchema)