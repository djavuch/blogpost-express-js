const Article = require('../../models/articles/ArticleModel')

exports.getAllArticles = async (req, res) => {
  const articlesPerPage = 20
  const page = (parseInt(req.query.page)) || 1

  try {
    const adminArticles = await Article.find({})
      .limit(articlesPerPage)
      .skip((page - 1) * articlesPerPage)

    const articlesCount = await Article.countDocuments(adminArticles)

    const pages = Math.ceil(articlesCount / articlesPerPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page < Math.ceil(articlesCount / articlesPerPage)

    if (adminArticles) {
      return res.render('admin/articles/table-articles', {
        title: 'List of articles',
        adminArticles,
        currentPage: page,
        pages,
        prevPage,
        nextPage,
        articlesPerPage
      })
    }
  } catch (err) {
    console.log(err)
  }
}

exports.addArticle = async (req, res) => {
  const article = new Article(req.body)
  article.author = req.user._id

  await article.save()

  req.flash('success', 'Article added')
  return res.redirect('/admin/articles')
}

exports.addArticleView = (req, res) => {
  res.render('admin/articles/form-add-article', {
    title: 'Article adding'
  })
}

exports.editArticle = async (req, res) => {
  const article = Article.findOne({ _id:  req.params.articleId })

  if (!article) {
    req.flash('warning', 'Article not found.')
    return res.redirect('/admin/articles')
  }

  const article_data = {
    title: req.body.title,
    text: req.body.text
  }

  await Article.findOneAndUpdate(article, article_data, { new: true })

  req.flash('success', 'Article was changed.')
  return res.redirect('/admin/articles')
}

exports.editArticleView = async (req, res) => {
  const article = await Article.findOne({ _id: req.params.articleId })
  res.render('admin/articles/form-edit-article', {
      title: article.title,
      article
  })
}

exports.deleteArticle = async (req, res) => {
  const articleId = { _id: req.params.articleId }

  const foundArticle = await Article.findOne(articleId)

  if (!foundArticle) {
    req.flash('warning', 'Article not found.')
    return res.redirect('/admin/articles')
  }

  await Article.deleteOne({ _id: articleId })

  req.flash('warning', 'Article was deleted.')
  return res.redirect('/admin/articles')
}