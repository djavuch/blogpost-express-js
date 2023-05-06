const roleAuthentication = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.redirect('/');
        }
        next()
    }
}

module.exports = {
  roleAuthentication
}
