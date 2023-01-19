const prevUrl = (req, res, next) => {
    req.session.returnTo = req.originalUrl
    next()
}

module.exports = prevUrl