const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', UserSchema)
module.exports.User = User