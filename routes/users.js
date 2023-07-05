const express = require('express')
const router = express.Router()
const { avatarUpload } = require('../configs/multer-config')

// Require controllers
const AuthController = require('../controllers/users/AuthController')
const AvatarController = require('../controllers/users/AvatarController')
const PwdController = require('../controllers/users/PwdController')
const ProfileController = require('../controllers/users/ProfileController')

// Require middleware
const { registerValidator, singInValidator, resetPwdValidator, newPwdValidator } = require('../utils/public-validators')
const { ensureAuthenticated } = require('../middleware/authorization')

// Sign up
router.get('/signup', AuthController.signupView)
router.post('/signup', registerValidator,  AuthController.signupOnPost)

// Sigh in and logout
router.post('/signin', singInValidator, AuthController.signin)
router.get('/logout', AuthController.logout)

// Reset password
router.get('/password/forgot', PwdController.reqToChangePwdView)
router.post('/password/send', resetPwdValidator, PwdController.reqToChangePwd)

router.get('/me', ensureAuthenticated, ProfileController.personalUserProfile)
router.post('/me/update/password', PwdController.updatePwd)

// User profile, edit and change avatar
router.get('/me/edit', ensureAuthenticated, ProfileController.editPersonalUserProfileView)
router.post('/me/edit/save', ensureAuthenticated, ProfileController.editUserProfileOnPost)
router.put('/me/upload_avatar/:id', ensureAuthenticated, avatarUpload.single('avatar'), AvatarController.uploadAvatar)
router.delete('/me/remove_avatar/:id', ensureAuthenticated, AvatarController.removeAvatar)
router.get('/:username', ProfileController.publicUserProfile)

router.get('/reset-password/:userId/:token', PwdController.changePwdView)
router.post('/reset-password/:userId/:token', PwdController.changePwd)

router.get('/confirm/:userId/:token', AuthController.verifyAccount)


module.exports = router