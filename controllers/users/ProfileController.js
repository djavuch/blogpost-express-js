const User = require("../../models/users/UserModel");

exports.publicUserProfile = async (req, res) => {
  const username = req.params.username.toLowerCase()
  const profile = await User.findOne({ username })
  res.render('users/profile/public_user_profile', {
    title: `${req.params.username}\' profile`,
    profile
  })
}

exports.personalUserProfile = (req, res) => {
  res.render('users/account/personal_page', {
    title: 'Personal page',
    user: req.user
  })
}

exports.editPersonalUserProfileView = (req, res) => {
  res.render('users/account/change_personal_page_layout', {
    title: 'Profile editing',
    user: req.user
  })
}

exports.editUserProfileOnPost = async (req, res, next) => {
  try {
    const user_data = {
      name: req.body.name,
      website: req.body.website,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      github: req.body.github,
      reddit: req.body.reddit,
      instagram: req.body.instagram,
      location: req.body.location,
      about: req.body.about,
      phoneNumber: req.body.phoneNumber
    }

    // const { username } = req.user

    await User.findOneAndUpdate({_id: req.user._id}, user_data, { new: true })

    res.redirect('/users/me')
  } catch (err) {
    next(err)
  }
}