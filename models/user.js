const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
        enum: ['admin', 'journalist', 'moderator', 'reader'],
        default: 'reader'
    },
    avatar: {
        type: String
    },
    where: {
        type: String
    },
    about: {
        type: String
    },
    website: {
        type: String
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

// Hash password
UserSchema.pre('save', async function save(next) {
    const user = this
    if (!user.isModified('password')) {
        return next()
    }
    try {
        user.password = await bcrypt.hash(user.password, 10)
        next()
    } catch(err) {
        next(err)
    }
})

// Compare password
UserSchema.methods.comparePassword = async function comparePassword(password, cb) {
    try {
        cb(null, await bcrypt.compare(password, this.password))
    } catch(err) {
        cb(err)
    }
}

module.exports = mongoose.model('User', UserSchema)

