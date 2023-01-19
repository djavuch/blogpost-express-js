const mongoose = require('mongoose')
const { ROLES } = require('../utils/constants')

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String, 
        enum: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.JOURNALIST, ROLES.READER],
        default: ROLES.READER
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

module.exports = mongoose.model('User', UserSchema)

