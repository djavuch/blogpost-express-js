const User = require('../../models/users/UserModel')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { promisify } = require('util')
const imageSize = promisify(require('image-size'))

exports.uploadAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!req.file) {
      return res.status(400)
    }

    // Check avatar dimension
    const dimension = await imageSize(req.file.path)

    if(dimension.width < 150 && dimension.height < 150) {
      await fs.unlinkSync(req.file.path)
      req.flash('warning', 'Minimum size for avatar 150x150.')
      return res.redirect('back')
    }

    // Cropping image
    await sharp(req.file.path)
      .resize({ width: 150, height: 150 })
      .toFile(path.resolve(req.file.destination, 'avatars', req.file.filename))

    // Remove source image
    fs.unlinkSync(req.file.path)

    if (user.avatar !== '') {
      try {
        fs.existsSync(path.join(__dirname, '../../', user.avatar))
        fs.unlinkSync(path.join(__dirname, '../../', user.avatar))
      } catch (err) {
        console.log(err)
      }
    }

    await user.updateOne({ avatar: `/uploads/avatars/${req.file.filename}` })
    res.redirect('/users/me')

  } catch (error) {
    next(error)
  }
}

exports.removeAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    // Checking if users has an avatar
    if (user.avatar !== '') {
      try {
        fs.existsSync(path.join(__dirname, '../../', user.avatar))
        fs.unlinkSync(path.join(__dirname, '../../', user.avatar))
      } catch (err) {
        console.log(err)
      }
    }
    // Update record in database
    await user.updateOne({avatar: ''})

    res.redirect('/users/me')
  } catch (error) {
    next(error)
  }
}