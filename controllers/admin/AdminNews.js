const News = require('../../models/news')
const NewsCategory = require('../../models/NewsCategory')

exports.listOfNews = (req, res) => {
    const aggregateListOfNews = News.aggregate([
        {
            $sort: { title: 1 },
        },
    ]) 
    
    const page  = req.query.page || 1

    News.paginate({}, {page: page}).then((newsList, err) => {
        if(!err) {
            res.render('admin/table-news', {
                title: 'News list',
                newsList: newsList.docs,
                hasNextPage: newsList.hasNextPage,
                hasPrevPage: newsList.hasPrevPage,
                currentPage: newsList.page, 
                totalPages: newsList.totalPages,
                pagingCounter: newsList.pagingCounter,
                data: {
                    aggregateListOfNews
                }
            })
        }
    })
}

exports.addNews = (req, res) => {
    const singleNews = new News(req.body)
    singleNews.author = req.user._id

    singleNews.save()
        .then(() => {
            req.flash('success', 'News added')
            res.redirect('/admin/news') 
        })
}

exports.editNews = (req, res) => {
    News.findByIdAndUpdate(req.params.id, req.body, err => {
        if(err) {
            console.log(err) 
            return
        } else {
            res.redirect('/admin/news')
        }
    })
}

exports.editNewsView = async (req, res) => {
    const news = await News.findById(req.params.id)
    res.render('admin/form-edit-news', { news })
}

exports.addNewsView = (req, res) => {
    NewsCategory.find({}, (err, newscategory) => { 
        if(err) {
            console.log(err)
        } else {
            res.render('admin/form-add-news', {
            title: 'News adding',
            newscategory: newscategory
        })  
        }
    })
}


exports.deleteNews = (req, res) => {
    News.findById(req.params.id)
        .then((news) => {
            news.remove(),
            req.flash('success', 'News deleted'),
            res.redirect('/admin/news')
        })
        .catch(err => {
            console.log(err)
    })
}
