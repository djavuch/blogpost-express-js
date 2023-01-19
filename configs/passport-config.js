const bcrypt = require('bcrypt')
const User  = require('../models/user')
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
    new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
        // Match User
        User.findOne({ username: username })
            .then(user => {
                // New user
                if(!user) {
                    const newUser = new User({ username, password})
                    // Hash password before saving in DB
                    bcrypt.genSalt(10, (salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash
                            newUser.save()
                                .then(user => {
                                    return done(null, user)
                                })
                                .catch(() => {
                                    return done(null, false, { message: "Incorrect username or password" })
                                })
                        })
                    })
                    //Return other user
                } else {
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: "Incorrect username or password" })
                        }
                    })
                }
            })
            .catch(err => {
                return done(null, false, { message: err })
            })
    })
)

module.exports = passport