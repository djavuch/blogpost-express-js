const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const upload = require('../configs/multer-config')
const { body, validationResult } = require('express-validator')
const { registerValidator } = require('../utils/validators')

router.get('/register', async (req, res) =>{
    res.render('register')
})

// // Edit profile (load form)
// router.get('/edit/:id', async (req, res) => {
//     const user = await User.findById(req.params.id) 
//     res.render('edit_profile', {
//         user: user
//     })
// })

router.post('/register', registerValidator, async (req, res) => {
    try {
        // Data entry validation
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg)
            })
            res.redirect('/users/register')
            return
        }
        // Сhecking for matches in the database
        const { email } = req.body
        const checkDbForMatches = await User.findOne({ email })
        if (checkDbForMatches) {
            req.flash('warning', 'This username/email is already taken!')
            res.redirect('/users/register')
            return
        }
        // Register logic
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        // Saving new user to the database
        await newUser.save()
        req.flash('success', 'You are now registered and can log in')
        res.redirect('/users/login')
    } catch (err) {
        console.log(err)
        res.redirect('/users/register')
    }
})

router.get('/login', async (req, res) =>{
    res.render('login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true, 
    }) (req, res, next)
})

router.get('/logout', (req, res, next) => {
    req.session.destroy()
    req.logout()
    res.redirect('/')

})

router.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('edit_profile', { 
        user: user 
    })
})

// Public profile
router.get('/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username})
    if (user == null) res.redirect('/')
    res.render('user_profile', { 
        user : user 
    })
})

// router.get('/:username', async (req, res) => {
//     User.findOne({username: req.params.username}, function(err, user) {
//         res.render('user_profile', {
//             user: user
//         })
//     })
// })

router.post('/:id', upload.single('avatar'), async (req, res, next) => {
    req.user = await User.findById(req.params.id),
    next()
}, saveUser('edit_profile'))

function saveUser(path) {
    return async (req, res) => {
        let user = req.user
        user.name = req.body.name
        user.about = req.body.about
        user.twitter = req.body.twitter
        user.facebook = req.body.facebook
        user.instagram = req.body.instagram
        user.reddit = req.body.reddit
        user.github = req.body.github
        user.avatar = req.file.filename    

        try {
            user = await user.save()
            res.redirect(`/users/${user.username}`)
        } catch (e) {
            res.render(`${path}`, { user : user})
        }
    }
}


module.exports = router