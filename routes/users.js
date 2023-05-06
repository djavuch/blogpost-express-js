const express = require('express')
const router = express.Router()
const userAvatarUpload = require('../configs/multer-config')

// Require controllers
const UsersController = require('../controllers/user/UsersController')
const AvatarController = require('../controllers/user/UsersAvatarController')

// Require middleware
const { registerValidator, singInValidator } = require('../utils/validators')

// Sign up
router.get('/signup', UsersController.signupView)
router.post('/signup', registerValidator,  UsersController.signupOnPost)

// Sigh in and logout
router.post('/signin', singInValidator, UsersController.signin)
router.get('/logout', UsersController.logout)

// User profile, edit and change avatar
router.get('/:username', UsersController.userProfileView)
router.get('/edit/:username', UsersController.editUserProfileView)
router.post('/edit/:username', UsersController.editUserProfileOnPost)
router.post('/upload/:username', userAvatarUpload.single('avatar'), AvatarController.uploadAvatar)
router.delete('/remove_avatar/:username', AvatarController.removeAvatar)

// router.get('/signup', async (req, res) => {
//   res.render('signup')
// })
//
// // // Edit profile (load form)
// // router.get('/edit/:id', async (req, res) => {
// //     const user = await User.findById(req.params.id)
// //     res.render('edit_profile', {
// //         user: user
// //     })
// // })
//
// router.post('/signup', registerValidator, async (req, res) => {
//   try {
//     // Data entry validation
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       errors.array().forEach((error) => {
//         req.flash('error', error.msg)
//       })
//       res.render('signup', {
//         username,
//         messages: req.flash()
//       })
//       return
//     }
//     // Check for matches in the database
//     const { email } = req.body
//     const checkDbForMatches = await User.findOne({email})
//     if (checkDbForMatches) {
//       req.flash('warning', 'This username/email is already taken!')
//       res.redirect('/users/register')
//       return
//     }
//     // Register logic
//     const newUser = new User({
//       name: req.body.name,
//       username: req.body.username,
//       email: req.body.email,
//       password: req.body.password
//     })
//     // Saving new user to the database
//     await newUser.save()
//     req.flash('success', 'You are now registered and can log in')
//     res.redirect('/')
//   } catch (err) {
//     console.log(err)
//     res.redirect('/users/register')
//   }
// })
//
// router.post('/signin', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err)
//     }
//     if (!user) {
//       req.flash('danger', 'No user found')
//       return res.redirect('/')
//     }
//     req.logIn(user, (err) => {
//       if (err) {
//         return next(err)
//       }
//       req.flash('success', {messageg: 'You are logged in.'});
//       res.redirect(req.session.returnTo || '/')
//     })
//   })(req, res, next)
// })
//
// router.get('/logout', (req, res, next) => {
//   req.logout()
//   req.session.destroy((err) => {
//     if(err)
//       console.log('Failed to destroy session.', err)
//       req.user = null
//       res.redirect('/')
//   })
// })
//
// router.get('/edit/:id', async (req, res) => {
//   const user = await User.findById(req.params.id)
//   res.render('edit_profile', {
//     user: user
//   })
// })
//
// // Public profile
// router.get('/:username', async (req, res) => {
//   const user = await User.findOne({username: req.params.username})
//   if (user == null) res.redirect('/')
//   res.render('user_profile', {
//     user: user
//   })
// })
//
// // router.get('/:username', async (req, res) => {
// //     User.findOne({username: req.params.username}, function(err, user) {
// //         res.render('user_profile', {
// //             user: user
// //         })
// //     })
// // })
//
// router.post('/:id', async (req, res, next) => {
//   req.user = await User.findById(req.params.id),
//     next()
// }, saveUser('edit_profile'))
//
// router.post('/upload/:id', userAvatarUpload.single('avatar'), async (req, res, next) => {
//   try {
//     const user = await User.findOne({'_id': req.params.id})
//
//     // if (req.body.avatar) {
//     //     const directoryPath = '../uploads'
//     //     if(!fs.existsSync(directoryPath)) {
//     //         fs.unlinkSync(directoryPath)
//     //     }
//     // }
//     //
//     // if (user.avatar !== defaultAvatar) {
//     //     const avatarPath = path.join(__dirname, `../uploads/${user.avatar}`)
//     //     if(fs.existsSync(avatarPath)) {
//     //         fs.unlinkSync(avatarPath)
//     //     }
//     // }
//     //
//     // if(req.body.avatar === defaultAvatar) {
//     //     user.avatar === defaultAvatar
//     // }
//     // const updateUser = await User.findByIdAndUpdate(req.params._id,
//     //     { avatar: req.file.path })
//     //
//     //
//     // await user.save(updateUser)
//     // console.log
//
//     if (!req.file) {
//       return res.status(400)
//     }
//
//     const newAvatar = req.file.filename
//
//     if (user.avatar !== '') {
//       try {
//         fs.unlinkSync(path.join(__dirname, '../uploads/', user.avatar))
//       } catch (err) {
//         console.log(err)
//       }
//     }
//     await user.updateOne({avatar: `../uploads/${newAvatar}`})
//     res.redirect(`/users/${req.user.username}`)
//
//   } catch (error) {
//     next(error)
//   }
//
// })
//
// router.delete('/remove_avatar/:id', async (req, res, next) => {
//   const user = await User.findOne({'_id': req.params.id})
//   // Checking if user has an avatar
//   if (user.avatar) {
//     try {
//       fs.existsSync(path.join(__dirname, '../uploads/', user.avatar))
//       fs.unlinkSync(path.join(__dirname, '../uploads/', user.avatar))
//     } catch (err) {
//       console.log(err)
//     }
//   }
//   // Update record in database
//   await user.updateOne({avatar: ''})
//
//   res.redirect(`/users/${req.user.username}`)
// })
//
// function saveUser(path) {
//   return async (req, res) => {
//     let user = req.user
//     user.name = req.body.name
//     user.about = req.body.about
//     user.twitter = req.body.twitter
//     user.facebook = req.body.facebook
//     user.instagram = req.body.instagram
//     user.reddit = req.body.reddit
//     user.github = req.body.github
//     user.avatar = defaultAvatar
//
//     try {
//       user = await user.save()
//       res.redirect(`/users/${user.username}`)
//     } catch (e) {
//       res.render(`${path}`, {user: user})
//     }
//   }
// }


module.exports = router