const NewsPost = require('../../models/news/NewsPostModel')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const imageSize = promisify(require('image-size'))

exports.listOfNews = async (req, res) => {
  const newsPerPage = 20
  const page = (parseInt(req.query.page)) || 1

  try {
    const adminNews = await NewsPost.find({})
      .populate('category')
      .limit(newsPerPage)
      .skip((page - 1) * newsPerPage)

    const newsCount = await NewsPost.countDocuments(adminNews)

    const pages = Math.ceil(newsCount / newsPerPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page < Math.ceil(newsCount / newsPerPage)

    if(adminNews) {
      return res.render('admin/news/table-news', {
        title: 'List of news',
        adminNews,
        currentPage: page,
        pages,
        prevPage,
        nextPage,
        newsPerPage
      })
    }
  } catch (err) {
    console.log(err)
  }
}

exports.addNews = async (req, res) => {
  try {
    const post = new NewsPost(req.body)

    post.author = req.user._id
    post.isTopNews = Boolean(req.body.isTopNews)

    if(req.file) {
      post.previewImage = req.file.path.replace(/\\/g,'/')

      const dimension = await imageSize(req.file.path)

      if(dimension.width < 1100 && dimension.height < 360) {
        await fs.unlinkSync(req.file.path)
        req.flash('warning', 'Preview image size should be 1100x360.')
        res.redirect('back')
      }
    }

    const posts = await NewsPost.findOne({ hotNews: true })
    if (posts) {
      await NewsPost.updateMany({ hotNews: false })
    }

    await post.save()
    req.flash('success', 'News added')
    return res.redirect('/admin/news')

  } catch (err) {
    console.log(err)
  }
}

exports.editNews = async (req, res) => {
  try {
    const news = { _id: req.params.id}

    if(req.file) {
      const dimension = await imageSize(req.file.path)

      if(dimension.width < 1100 && dimension.height < 360) {
        await fs.unlinkSync(req.file.path)
        req.flash('warning', 'Preview image size should be 1100x360.')
        return res.redirect('back')
      }
      fs.existsSync(path.join(__dirname, '../../', news.previewImage))
      fs.unlinkSync(path.join(__dirname, '../../', news.previewImage))
    }

    const news_data = {
      category: req.body.category,
      title: req.body.title,
      text: req.body.text,
      isTopNews: Boolean(req.body.isTopNews),
      previewImage: req.file?.path.replace(/\\/g,'/')
    }

    await NewsPost.findOneAndUpdate(news, news_data, { new: true })

    return res.redirect('/admin/news')
  } catch (err) {
    console.log(err)
  }
}

exports.editNewsView = async (req, res) => {
  const news = await NewsPost.findById(req.params.id)
  res.render('admin/news/form-edit-news', {
    title: news.title,
    news
  })
}

exports.addNewsView = (req, res) => {
  res.render('admin/news/form-add-news', {
    title: 'Add news'
  })
}


exports.deleteNews = (req, res) => {
  NewsPost.findById(req.params.id)
    .then((news) => {
      news.deleteOne()
        news.removeImagesWithPost()
        req.flash('success', 'News deleted')
        res.redirect('/admin/news')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.uploadPics = (req, res) => {
  res.json({
    location:
      "/uploads/" + req.file.filename,
  })
}

// const singleFileUpload = async (req, res, next) => {
//     try{
//         const file = new SingleFile({
//             fileName: req.file.originalname,
//             filePath: req.file.path,
//             fileType: req.file.mimetype,
//             fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
//         });
//         await file.save();
//         res.status(201).send('File Uploaded Successfully');
//     }catch(error) {
//         res.status(400).send(error.message);
//     }
// }