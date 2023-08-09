const passport = require('passport')
const User = require('../../models/users/UserModel')
const UserToken = require('../../models/users/UserToken')
const crypto = require('crypto');
const sendEmail = require('../../configs/email')

exports.signupView = (req, res) => {
  res.render('users/account/signup', {
    title: 'Register'
  })
}

exports.signupOnPost = async (req, res) => {
  try {
    // Register and save in database
    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })

    await user.save()

    // Generate verification token
    const token = await new UserToken({
      userId: user._id,
      token: crypto.randomBytes(24).toString('hex')
    })

    await token.save()

    const link = `http://localhost:3000/users/confirm/${user._id}/${token.token}`

    await sendEmail(user.email,
      'Confirm registration',
      'Hello, \n\n' +
      `Thank you for register. Please activate your account to get access for all features ${link}. It's valid for 1 hour from the moment you receive this message. \n\n`
      )

    req.flash('success', 'Your account activation information has been sent to your email.')
    res.redirect('/')
  } catch(err) {
    console.log(err)
  }
}

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {

    if(err) {
      return next(err)
    }
    if(!user) {
      req.flash('info', info)
      return res.redirect('back')
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', 'You are logged in.');
      res.redirect(req.session.returnTo || 'back')
    })
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err)
    req.user = null
    res.redirect('back')
  })
}

exports.verifyAccount = async (req, res) => {
  try {
    // Checking if such a user exists
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(400).send('Not user found.')

    // Checking verify token
    const token = await UserToken.findOne({
      userId: user._id,
      token: req.params.token
    })

    if (!token) return res.status(400).send('Invalid token.')

    // If the check was successful, change the account status to activated
    user.isVerified = true

    await user.save()

    await token.delete()

    req.flash('success', `Welcome, ${user.name}! Now you have full access to the discussions.`)
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
}

exports.resendVerifyEmail = async (req, res) => {
  // found user in db
  const user = await User.findOne({ _id: req.user._id })

  if(!user) {
    req.flash('error', 'Account not found.')
    res.redirect('back')
  }
  // check if user is verified
  if(user.isVerified) {
    req.flash('info', 'Your account is confirmed.')
    res.redirect('back')
  }
  // found old token
  const foundOldToken = await UserToken.findOne({ userId: req.user._id })

  if(foundOldToken) {
    await foundOldToken.deleteOne()
  }
  // generate news token
  const token = await new UserToken({
    userId: user._id,
    token: crypto.randomBytes(24).toString('hex')
  })

  await token.save()

  const link = `http://localhost:3000/users/confirm/${user._id}/${token.token}`

  await sendEmail(user.email,
    'Confirm registration',
    'Hello, \n\n' +
    `Thank you for register. Please activate your account to get access for all features ${link}. It's valid for 1 hour from the moment you receive this message. \n\n`
  )

  req.flash('success', 'Your account activation information has been sent to your email.')
  res.redirect('/')
}