const express = require('express')
const adminUsersRouter = express.Router()

const AdminUsers = require('../../controllers/admin/AdminUsersController')
const { newsImageUpload } = require('../../configs/multer-config')
const validations = require('../../utils/admin-validators')

adminUsersRouter
  .get('/', AdminUsers.getAllUsers)
  .get('/edit/:profileId', AdminUsers.editUserProfileView)
  .put('/edit/:profileId',
    newsImageUpload.single('avatar'),
    // validations.userValidator,
    // validations.handleValidation,
    AdminUsers.editUserProfile)
  .delete('/:profileId', AdminUsers.deleteUser)

module.exports = adminUsersRouter