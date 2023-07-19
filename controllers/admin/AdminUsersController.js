const User = require('../../models/users/UserModel')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { promisify } = require('util')
const imageSize = promisify(require('image-size'))

exports.getAllUsers = async (req, res) => {
  const usersPerPage = 20
  const page = (parseInt(req.query.page)) || 1

  try {
    const listOfUsers = await User.find({})
      .limit(usersPerPage)
      .skip((page - 1) * usersPerPage)

    const usersCount = await User.countDocuments(listOfUsers)

    const pages = Math.ceil(usersCount / usersPerPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page < Math.ceil(usersCount / usersPerPage)

    if (listOfUsers) {
      return res.render('admin/users/table-users', {
        title: 'List of users',
        listOfUsers,
        currentPage: page,
        pages,
        prevPage,
        nextPage,
        usersPerPage
      })
    }
  } catch (err) {
    console.log(err)
  }
}

exports.editUserProfileView = async (req, res) => {
  const profileId = req.params.profileId
  const profile = await User.findOne({ _id: profileId })
  res.render('admin/users/form-edit-user', {
    title: profile.username,
    profile
  })
}

exports.editUserProfile = async (req, res) => {
  try {

    const profileId = req.params.profileId

    const profile = await User.findOne({ _id: profileId })

    const user_data = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      role: req.body.role,
      website: req.body.website,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      github: req.body.github,
      reddit: req.body.reddit,
      instagram: req.body.instagram,
      location: req.body.location,
      about: req.body.about,
      phoneNumber: req.body.phoneNumber,
    }

    if(req.file) {
      const dimension = await imageSize(req.file.path)

      if(dimension.width < 150 && dimension.height < 150) {
        await fs.unlinkSync(req.file.path)
        req.flash('warning', 'Avatar size should be 150x150.')
        return res.redirect('back')
      }
      // cropping new image to
      await sharp(req.file.path)
        .resize({ width: 150, height: 150 })
        .toFile(path.join(__dirname, '../../uploads/avatars/', req.file.filename))
      // Remove source image
      fs.unlinkSync(req.file.path)

      // remove old avatar
      if(profile.avatar !== '') {
        try {
          fs.existsSync(path.join(__dirname, '../../', profile.avatar))
          fs.unlinkSync(path.join(__dirname, '../../', profile.avatar))
        } catch (err) {
          console.log(err)
        }
      }

      user_data.avatar = `/uploads/avatars/${req.file.filename}`
    }

    await User.findOneAndUpdate({ _id: profileId }, user_data, { new: true })

    return res.redirect('/admin/users')
  } catch (err) {
    console.log(err)
  }
}
