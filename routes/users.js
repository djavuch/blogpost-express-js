const express = require('express')
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt')
const { User } = require('../models/user');

router.get('/register', async (req, res) =>{
    res.render('register')
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

module.exports = router