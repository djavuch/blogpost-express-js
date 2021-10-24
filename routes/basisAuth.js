function authUser(req, res, next) {
    if(req.user == null) {
        res.status(403)
        return req.flash('success', 'You need to sign in')
    }
}

module.exports = {
    authUser
}