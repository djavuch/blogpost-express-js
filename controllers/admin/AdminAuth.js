const passport = require('passport')

exports.authToAdminPanel = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/auth',
        failureFlash: true
    })
    (req, res, next)
}

exports.authToAdminPanelView = function(req, res) {
    res.render('admin/page-login', {
        title: 'Admin panel'
    })
}