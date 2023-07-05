const ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next()
  }
  req.flash('warning', 'Please login to access this route.')
  res.redirect('/')
}

const ensureAdmin = (req, res, next) => {
  if(req.user.role === 'admin') {
    next()
  } else {
    req.flash('warning', 'You are not authorized for access to this route!')
    res.redirect('/')
  }
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin
}

