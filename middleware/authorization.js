const User = require('../models/user')

const roleAuthorization = roles => {
    return (req, res, next) => {
        const user = req.user

        User.findById(user._id, (err, foundUser) => {
            if (err) {
                res.status(422)
                console.log('No user found')
                return next(err)
            }
            if (roles.indexOf(foundUser.role) > -1) {
                return next()
            }
        })
        res.status(401)
        return next('Unathorized')
    }
}

module.exports = {
    roleAuthorization
}