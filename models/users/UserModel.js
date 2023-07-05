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
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['admin', 'journalist', 'moderator', 'reader'],
    default: 'reader'
  },
  avatar: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  facebook: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  reddit: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  about: {
    type: String
  },
  phoneNumber: {
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
    if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
      this.role = 'admin'
    }
    next()
  } catch (err) {
    next(err)
  }
})

// Compare password
UserSchema.methods.comparePassword = async function comparePassword(password, cb) {
  try {
    cb(null, await bcrypt.compare(password, this.password))
  } catch (err) {
    cb(err)
  }
}

module.exports = mongoose.model('User', UserSchema)

