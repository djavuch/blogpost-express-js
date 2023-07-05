const mongoose = require('mongoose')
const NewsPost = require('../../models/news/NewsPostModel')
const NewsCategory = require('../../models/news/NewsCategoryModel')
const Comment = require('../../models/news/NewsCommentsModel')

// News by category
exports.getNewsByCategory = async (req, res, next) => {
  try {
    const newsPerPage = 15
    const page = (parseInt(req.query.page)) || 1
    const skipPage = (page - 1) * newsPerPage

    const category = await NewsCategory.findOne({ title: req.params.category_slug })


    if (!category) {
      return res.status(404)
    }

    const newswireByCategory = await NewsPost.find({ category: category })
      .limit(newsPerPage)
      .skip(skipPage)

    const newsCountInCategory = await NewsPost.countDocuments({ newswireByCategory: category })

    const pages = Math.ceil(newsCountInCategory / newsPerPage)
    const prevPage = page === 1 ? null : page - 1
    const newsPage = page < Math.ceil(newsCountInCategory / newsPerPage)

    if (newswireByCategory) {
      return res.render('news/news_by_category', {
        title: category.title,
        newswireByCategory,
        currentPage: page,
        category,
        pages,
        prevPage,
        newsPage,
        newsPerPage
      })
    }
  } catch (err) {
    next(err)
  }
}

// All news on GET
exports.getNewswire = async (req, res) => {
  try {
    const newsPerPage = 15
    const page = (parseInt(req.query.page)) || 1
    const skipPage = (page - 1) * newsPerPage

    const newswire = await NewsPost.find({})
      .populate('category')
      .limit(newsPerPage)
      .skip(skipPage)

    const newsCount = await NewsPost.countDocuments(newswire)

    const pages = Math.ceil(newsCount / newsPerPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page < Math.ceil(newsCount / newsPerPage)

    if (newswire) {
      return res.render('news/newswire', {
        title: 'Newswire',
        newswire,
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

// Single news on GET
exports.getNews = async (req, res, next) => {
  const commentPerPage = 10
  const page = (parseInt(req.query.page)) || 1

  try {
    const news = await NewsPost.findOne({slug: req.params.news_slug})
      .populate({
        path: 'comments',
        options: {
          skip: (page - 1) * commentPerPage,
          limit: commentPerPage,
        }
      }).exec()

    const commentCount = await Comment.countDocuments({newsId: news})
      .exec()

    const pages = Math.ceil(commentCount / commentPerPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page < Math.ceil(commentCount / commentPerPage)

    if (news) {
      // News view counter
      news.incrementViewsCounter()
      return res.render('news/news_body', {
        title: news.title,
        news,
        comments: news.comments,
        currentPage: page,
        pages,
        prevPage,
        nextPage
      })
    }
    res.status(404)

  } catch (err) {
    next(err)
  }
}