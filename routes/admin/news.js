const express = require('express')
const adminNewsRouter = express.Router()

// Require controllers
const AdminNews = require('../../controllers/admin/AdminNewsController')
const { newsImageUpload } = require('../../configs/multer-config')
const validations = require('../../utils/admin-validators')

adminNewsRouter.get('/', AdminNews.listOfNews)
  .get('/add', AdminNews.addNewsView)
  .post('/add',
    newsImageUpload.single('previewImage'),
    validations.newsCreateValidator,
    validations.handleValidation,
    AdminNews.addNews
  )
  .get('/edit/:newsId', AdminNews.editNewsView)
  .put('/edit/:newsId',
    newsImageUpload.single('previewImage'),
    validations.newsEditValidator,
    validations.handleValidation,
    AdminNews.editNews
  )
  .delete('/:id', AdminNews.deleteNews)

// TODO - in working
// router.post('/news/upload', upload.single('images'), AdminNews.uploadPics)

module.exports = adminNewsRouter