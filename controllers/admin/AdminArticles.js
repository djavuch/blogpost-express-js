const Article = require('../../models/article')

exports.listOfArticles = function(req, res) {
    const aggregatelistOfArticles = Article.aggregate([
        {
            $sort: { title: 1 },
        },
    ]) 
    
    const { page } = req.query
    const options = {
        page: parseInt(page, 20) || 1,
        limit: 20
    }

    Article.paginate({}, options).then((articlesList, err) => {
        if(!err) {
            res.render('admin/table-articles', {
                title: 'Articles list',
                articlesList: articlesList.docs,
                hasNextPage: articlesList.hasNextPage,
                hasPrevPage: articlesList.hasPrevPage,
                currentPage: articlesList.page, 
                totalPages: articlesList.totalPages,
                pagingCounter: articlesList.pagingCounter,
                data: {
                    aggregatelistOfArticles
                }
            })
        }
    })
}

exports.addArticle = (req, res) => {
    const article = new Article(req.body)
    article.author = req.user._id

    article.save()
        .then(() => {
            req.flash('success', 'Article added'),
            res.redirect('/admin/articles')
        })
}

exports.addArticleView = (req, res) => {
    res.render('admin/form-add-article', {
        title: 'Article adding'
    })
}

exports.editArticle = (req, res) => {
    Article.findByIdAndUpdate(req.params.id, req.body, err => {
        if(err) {
            console.log(err)
            return
        } else {
            res.redirect('/admin/articles')
        }
    })
}

exports.editArticleView = (req, res) => {
    Article.findById(req.params.id, err, article => {
        res.render('admin/form-edit-article', {
            title: 'Article edit',
            article: article
        })
    })
}

exports.deleteArticle = (req, res) => {
    Article.findById(req.params.id)
        .then((article) => {
            article.remove(),
            req.flash('success', 'Article deleted'),
            res.redirect('/admin/articles')
        })
        .catch(err => {
            console.log(err)
    })
}