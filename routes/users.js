const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const path = require('path')
const upload = require('../middleware/multer-config')

router.get('/register', async (req, res) =>{
    res.render('register')
})

// Edit profile (load form)
router.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id) 
    res.render('edit_profile', {
        user: user
    })
})

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        newUser.save()
        req.flash('success', 'You are now registered and can log in');
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
    req.logOut()
    req.flash('success', 'You are logged out')
    res.redirect('/users/login')
})

router.get('/edit/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('edit_profile', { user: user })
})

// Public profile
router.get('/:username', async (req, res) => {
    const user = await User.findOne({username: req.params.username})
    if (user == null) res.redirect('/')
    res.render('user_profile', { user: user })
})

router.put('/:id', upload.single('avatar'), async (req, res, next) => {
    req.user = await User.findById(req.params.id)
    next()
    console.log(req.file)
}, saveUser('edit_profile'))

function saveUser(path) {
    return async (req, res) => {
        let user = req.user
        user.name = req.body.name,
        user.avatar = req.file.filename,
        user.about = req.body.about,
        user.twitter = req.body.twitter,
        user.facebook = req.body.facebook,
        user.instagram = req.body.instagram,
        user.reddit = req.body.reddit,
        user.github = req.body.github

        try {
            user = await user.save()
            res.redirect(`/users/${user.username}`)
        } catch (e) {
            res.render(`${path}`, { user : user})
        }
    }
}

module.exports = router