const User = require('../../models/user')
const fs = require('fs')
const path = require("path");

exports.uploadAvatar = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })

    if (!req.file) {
      return res.status(400)
    }

    const newAvatar = req.file.filename

    if (user.avatar !== '') {
      try {
        fs.unlinkSync(path.join(__dirname, '../uploads/', user.avatar))
      } catch (err) {
        console.log(err)
      }
    }
    await user.updateOne({avatar: `../uploads/${newAvatar}`})
    res.redirect(`/users/${req.user.username}`)

  } catch (error) {
    next(error)
  }
}

exports.removeAvatar = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    // Checking if user has an avatar
    if (user.avatar !== '') {
      try {
        fs.existsSync(path.join(__dirname, '../../uploads/', user.avatar))
        fs.unlinkSync(path.join(__dirname, '../../uploads/', user.avatar))
      } catch (err) {
        console.log(err)
      }
    }
    // Update record in database
    await user.updateOne({avatar: ''})

    res.redirect(`/users/${req.user.username}`)
  } catch (error) {
    next(error)
  }
}