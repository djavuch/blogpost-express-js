const passport = require('passport')
const User = require('../../models/user')
const { body, validationResult } = require('express-validator')

exports.signupView = (req, res) => {
  res.render('signup')
}

exports.signupOnPost = async (req, res, next) => {
  try {
    // Data entry validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        req.flash('error', error.msg)
      })
      res.redirect('/users/signup')
    }
    // Register logic
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    // Saving new user to the database
    await newUser.save()
    req.flash('success', 'You are now registered and can log in')
    res.redirect('/')
  } catch(err) {
    console.log(err)
    next(err)
  }
}

exports.signin = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('warning', error.msg)
    })
    return res.redirect('/')
  }
  passport.authenticate('local', (err, user, info) => {

    if(err) {
      return next(err)
    }
    if(!user) {
      req.flash('info', info)
      return res.redirect('/')
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'You are logged in.');
      res.redirect(req.session.returnTo || '/')
    })
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()
  req.session.destroy((err) => {
    if(err)
      console.log('Failed to destroy session.', err)
    req.user = null
    res.redirect('/')
  })
}

exports.userProfileView = async (req ,res) => {
  const user = await User.findOne({ 'username': req.params.username })
  if (user == null) res.redirect('/')
  res.render('user_profile', {
    user
  })
}

exports.editUserProfileView = async (req, res) => {
  const user = await User.findOne({ 'username': req.params.username })
  res.render('edit_profile', {
    user
  })
}

exports.editUserProfileOnPost = async (req, res, next) => {
  req.user = await User.findOne({ 'username': req.params.username })
    next()
}, saveUser('edit_profile')


function saveUser(path) {
  return async (req, res) => {
    let user = req.user
    user.name = req.body.name
    user.about = req.body.about
    user.twitter = req.body.twitter
    user.facebook = req.body.facebook
    user.instagram = req.body.instagram
    user.reddit = req.body.reddit
    user.github = req.body.github

    try {
      user = await user.save()
      res.redirect(`/users/${user.username}`)
    } catch (e) {
      res.render(`users/${path}`, { user: user })
    }
  }
}
