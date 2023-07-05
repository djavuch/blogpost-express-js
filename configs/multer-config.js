const multer = require('multer')

const avatarStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/').reverse()[0])
  }
})

const newsImageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/news/')
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/').reverse()[0])
  }
})

const types = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter
})
const newsImageUpload = multer({
  storage: newsImageStorage,
  fileFilter
})

module.exports = {
  avatarUpload,
  newsImageUpload
}