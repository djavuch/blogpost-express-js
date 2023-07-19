const Article = require('../models/articles/ArticleModel')
const NewsPost = require('../models/news/NewsPostModel')

exports.mainRouteNewsArticles = async (req, res) => {
  const newsPerPage = 7
  const articlesPerPage = 7

  const breaking = await NewsPost.findOne({ isTopNews: true }).exec()

  const newswire = await NewsPost.find({}).sort({created_on: -1}).limit(newsPerPage)
  const articles = await Article.find({}).limit(articlesPerPage)

  res.render('index', {
    title: 'Main',
    newswire, articles, breaking, newsPerPage, articlesPerPage
  })
}
