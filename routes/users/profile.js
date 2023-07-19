const express = require('express')
const userProfilesRouter = express.Router()

const ProfileController = require('../../controllers/users/ProfileController')
const AvatarController = require('../../controllers/users/AvatarController')
const PwdController = require('../../controllers/users/PwdController')

const { ensureAuthenticated } = require('../../middleware/authorization')

const { avatarUpload } = require('../../configs/multer-config')

userProfilesRouter
  // Personal profile
  .get('/me',
    ensureAuthenticated,
    ProfileController.personalUserProfile
  )
  // Change pwd on personal page
  .post('/me/update/password',
    ensureAuthenticated,
    PwdController.updatePwd
  )

  // Change personal proifle
  .get('/me/edit',
    ensureAuthenticated,
    ProfileController.editPersonalUserProfileView
  )
  // Save changes in personal profile
  .post('/me/edit/save',
    ensureAuthenticated,
    ProfileController.editUserProfileOnPost
  )
  // Upload avatar
  .put('/me/upload_avatar/:id',
    ensureAuthenticated,
    avatarUpload.single('avatar'),
    AvatarController.uploadAvatar
  )
  // Delete avatar
  .delete('/me/remove_avatar/:id',
    ensureAuthenticated,
    AvatarController.removeAvatar
  )
  // Public profile
  .get('/:username',
    ProfileController.publicUserProfile
  )

module.exports = userProfilesRouter