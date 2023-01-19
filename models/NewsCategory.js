const mongoose = require('mongoose')
const slugify = require('slugify')

const newsCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter the category name'],
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
},
    {   
        timestamps: {
            createdAt: 'created_on', 
            updatedAt: 'updated_on'
    }
})

newsCategorySchema.pre('validate', function(next) {
    if(this.title) {
        this.slug = slugify(this.title, { lower: true, 
        strict: true })
    }
    next()
})

module.exports = mongoose.model('newsCategory', newsCategorySchema)