const mongoose = require('mongoose')

// User Schema
const UserSchema = new mongoose.Schema({
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
        required: true,
        unique: true
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
    },
    role: {
        type: String, 
        enum: ['admin', 'user', 'moderator'],
        default: 'user',
        required: true
    },
    avatar: {

        type: String
    },
    about: {
        type: String,
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    github: {
        type: String
    },
    reddit: {
        type: String
    },
    instagram: {
        type: String
    }
})

const User = mongoose.model('User', UserSchema)
module.exports = User