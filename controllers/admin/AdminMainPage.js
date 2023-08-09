const NewsPost = require('../../models/news/NewsPostModel')
const NewsComment = require('../../models/news/NewsCommentsModel')
const Article = require('../../models/articles/ArticleModel')
const ArticleComment = require('../../models/articles/ArticleCommentsModel')
const User = require('../../models/users/UserModel')

exports.mainPage = async (req, res) => {
  const news = await NewsPost.countDocuments(),
        articles = await Article.countDocuments(),
        newsComments = await NewsComment.countDocuments(),
        articleComments = await ArticleComment.countDocuments(),
        users = await User.countDocuments()
  let sumComments = newsComments + articleComments

  res.render('admin/index', {
    title: 'Admin Panel',
    news, articles, sumComments, users
  })
}