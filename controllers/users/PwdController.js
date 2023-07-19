const User = require('../../models/users/UserModel')
const UserToken = require('../../models/users/UserToken')
const crypto = require('crypto')
const sendEmail = require('../../configs/email')

exports.reqToChangePwdView = (req, res) => {
  res.render('users/account/password_reset/resetpwd', {
    title: 'Reset password'
  })
}

exports.reqToChangePwd = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email})

    let token = await UserToken.findOne({userId: user._id})

    if (!token) {
      token = await new UserToken({
        userId: user._id,
        token: crypto.randomBytes(24).toString('hex')
      }).save()
    }

    const link = `http://localhost:3000/users/reset-password/${user._id}/${token.token}`

    await sendEmail(user.email,
      'Password reset',

      'Hello, \n\n' +
      `Your password recovery ${link}. It's valid for 1 hour from the moment you receive this message. \n\n` +
      'If you did not request a password reset, please ignore this message. In case of repeated incidents, contact the administrator.')

    res.redirect('/')
    req.flash('success', 'Instructions and a link to reset password have been sent to your email.')
  } catch (err) {
    console.log(err, 'An error occured')
  }
}

exports.changePwdView = async (req, res) => {
  const token = await UserToken.findOne({ token: req.params.token })
  if (!token) {
    req.flash('error', 'The recovery link has expired or is invalid')
    res.redirect('/users/password/forgot')
  }
  res.render('users/account/password_reset/changepwd', {
      title: 'Reset password',
      token
    }
  )
}

exports.changePwd = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(400)

    const token = await UserToken.findOne({
      userId: user._id,
      token: req.params.token
    })

    if (!token) return res.status(400)

    user.password = req.body.password
    await user.save()
    await token.delete()

    req.flash('success', 'You changed a password and can sing in.')
    res.redirect('/')

  } catch(err) {
    console.log(err)
  }
}

exports.updatePwdView = async (req, res) => {
  const username = req.params.username.toLowerCase()
  const user = await User.findOne({ username })
  res.render('users/account/user_profile_change_password', {
    title: 'Profile editing',
    user
  })
}

exports.updatePwd = async (req, res) => {
  try {
    const { currentPwd } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(400).send('User not found')

    req.user.comparePassword(currentPwd, async (err, isMatch) => {
      if(!isMatch) {
        req.flash('warning', 'Password is not correct.')
        return res.redirect('/users/update/me')
      }
      return err
    })

    user.password = req.body.password
    await user.save()

    req.flash('success', 'You have successfully changed your password.')
    return res.redirect('/users/update/me')
  } catch(err) {
    console.log(err)
  }
}