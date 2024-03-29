const User = require('../models/users/UserModel')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(
  new LocalStrategy({usernameField: 'username'}, (username, password, done) => {

    // Match users
    User.findOne({username: username}, (err, user) => {
      if (err) {
        return done(err)
      }
      if (!user || !user.password) {
        return done(null, false, {message: 'Username or password not found.'})
      }
      // if (!users.password) {
      //     return done(null, false, { message: 'Username or password not found.' })
      // }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err)
        }
        if (isMatch) {
          return done(null, user)
        }
        return done(null, false, {message: 'Incorrect username or password.'})
      })
    })
}))

module.exports = passport