const Article = require('../../models/articles/ArticleModel')
const ArticleComment = require('../../models/articles/ArticleCommentsModel')

// Get single Article
exports.getArticle = async  (req, res, next) => {
  const commentPerPage = 10
  const page = (parseInt(req.query.page)) || 1
  const skipComments = (page - 1) * commentPerPage

  try {
    const article = await Article.findOne({ slug: req.params.articleSlug })
      .populate({
        path: 'comments',
        options: {
          skip: skipComments,
          limit: commentPerPage
        }
      })

    if (!article) {
      req.flash('info', 'This article was not found or has been removed.')
      return res.redirect('/')
    }

    const commentCount = await ArticleComment.countDocuments({ articleId: article })

    const pages = Math.ceil(commentCount / commentPerPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page < Math.ceil(commentCount / commentPerPage)

    if (article) {
      return res.render('articles/article', {
        title: article.title,
        article,
        comments: article.comments,
        currentPage: page,
        pages,
        prevPage,
        nextPage
      })
    }
  } catch (err) {

  }
}

// All articles on GET
exports.getAllArticles = async (req, res) => {
  try {
    const articlesPerPage = 15
    const page = (parseInt(req.query.page)) || 1
    const skipPage = (page - 1) * articlesPerPage

    const articles = await Article.find({})
      .limit(articlesPerPage)
      .skip(skipPage)

    const articlesCount = await Article.countDocuments(articles)

    const pages = Math.ceil(articlesCount / articlesPerPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page < Math.ceil(articlesCount / articlesPerPage)

    if (articles) {
      return res.render('articles/all_articles', {
        title: 'Personal blog',
        articles,
        currentPage: page,
        pages,
        prevPage,
        nextPage,
        newsPerPage: articlesPerPage
      })
    }
  } catch (err) {
    console.log(err)
  }
}