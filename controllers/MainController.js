const Article = require('../models/articles/ArticleModel')
const NewsPost = require('../models/news/NewsPostModel')

exports.mainRouteNewsArticles = async (req, res) => {
  const newsPerPage = 7
  const articlesPerPage = 7
  const time = new Date()
  time.setDate(time.getDate() - 14)

  const breaking = await NewsPost.findOne({ isBreaking: true})

  const mostViewedNews = await NewsPost.aggregate([
    { $match: { created_on: { $gt: time } } },
    { $sort: { views: - 1 } },
    { $limit: 2 }
  ])

  const newswire = await NewsPost.find({}).sort({created_on: -1}).limit(newsPerPage)
  const articles = await Article.find({}).sort({created_on: -1}).limit(articlesPerPage)

  // res.status(200).json(mostViewedNews)

  res.render('index', {
    title: 'Main',
    newswire, articles, breaking, mostViewedNews, newsPerPage, articlesPerPage
  })
}

exports.searchOnSite = async (req, res) => {
  try {
    const searchQuery = req.query.results

    const newsSearch = await NewsPost.find({
      $text: { $search: searchQuery }
    })

    res.render('search', {
      title: 'Search results',
      searchQuery,
      newsSearch
    })
  } catch (err) {
    console.log(err)
  }

}
