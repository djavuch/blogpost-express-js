const newsCategory = require('../../models/NewsCategory')

exports.addNewsCategory = (req, res, next) => {
    const category = new newsCategory(req.body)
    category.save()
        .then(() => {
            req.flash('success', 'Category added')
            res.redirect('/admin/news-categories')
        },
        (err) => next(err)
    )
    .catch((err) => next(err))
}   

exports.addNewsCategoryView = (req, res) => {
    res.render('admin/news-categories/form-add-news-category', {
        title: 'Category adding'
    })
}

exports.editNewsCategory = (req, res, next) => {
    newsCategory.findByIdAndUpdate(req.params.category, req.body)
        .then(() => {
            req.flash('success', 'Category edited')
            res.redirect('/admin/news-categories')
        },
        (err) => next(err)
    )
    .catch((err) => next(err))
}

exports.editNewsCategoryView = (req, res) => {a
    res.render('admin/news-categories/form-edit-news-category', {
        title: 'Change category name'
    })
}

exports.deleteNewsCategory = (req, res) => {
    newsCategory.findById(req.params.category)
        .then((category) => {
            category.remove(),
            req.flash('success', 'Category deleted'),
            res.redirect('/admin/news-categories')
        })
}

exports.listOfCategories = (req, res) => {
    newsCategory.find({})
        .then((categoriesList) => {
            res.render('admin/news-categories/table-news-categories', {
                title: 'News categories',
                categoriesList: categoriesList
            })
        })
}