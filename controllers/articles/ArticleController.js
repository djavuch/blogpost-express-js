const Article = require('../../models/articles/ArticleModel')
const User = require('../../models/users/UserModel')

// Article add create on GET
exports.getAddArticle = function (req, res) {
    res.render('ArticleViews/add_article'), 
    {
        title: 'Add Article'
    }
}

// Article add create on POST
exports.addArticle = function (req, res) {
    let article = new Article()
    article.title = req.body.title
    article.author = req.user._id
    article.body = req.body.body

    article.save(function(err) {
        if(err){
            console.log(err)
            return
        } else {
            req.flash('success', 'Article added')
            res.redirect('/')
        }
    })
}

// Article edit create on GET
exports.getEditArticle = function (req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('ArticleViews/edit_article', {
            title: 'Edit Article',
            article: article
        })
    })
}

// Article edit create on POST
exports.editArticle = function (req, res) {
    let article = {}
    article.title = req.body.title
    article.author = req.user._id
    article.body = req.body.body

    let query = { _id: req.params.id }

    Article.updateOne(query, article, function(err) {
        if(err){
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
}

// Delete Article
exports.deleteArticle = async function (req, res) {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
}

// Get single Article
exports.getArticle = function (req, res) {
    Article.findById(req.params.id).populate('articleComments').lean()
        .then(article => res.render('ArticleViews/article', { 
            article 
        }))
        .catch((err) => {
            console.log(err.message)
    })
}

