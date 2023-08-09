const NewsPost = require('../models/news/NewsPostModel')
const Article = require('../models/articles/ArticleModel')
const NewsComment = require('../models/news/NewsCommentsModel')
const ArticleComment = require('../models/articles/ArticleCommentsModel')

exports.deleteAuthor = async (req, res) => {
  const newsAuthor = await NewsPost.findOne({ _id: req.query.author })
  const news = await NewsPost.findByIdAndUpdate({ _id: newsAuthor.author },
    {
      $pull: { author: req.params.newsAuthor }
    }
  ).exec()

  if (!news) {
    return res.status(404)
  }

  news.save()
}