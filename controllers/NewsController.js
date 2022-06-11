const News = require('../models/news')
const User = require('../models/user')
const Comment = require('../models/comment')
const news = require('../models/news')

//News add create on POST
exports.addNews = function (req, res) {
    // const news = new News()
    // news.title = req.body.title
    // news.author = req.user._id
    // news.body = req.body.body
    

    // news.save(function(err) {
    //     if(err) {
    //         console.log(err)
    //         return
    //     } else {
    //         News.findById(req.params.id)
    //         req.flash('success', 'News added')
    //         return res.redirect(`/news/${req.params.id}`)
    //     }
    // })

    const singleNews = new News(req.body)
    singleNews.author = req.user._id

    singleNews.save()
        .then(() => {
            req.flash('success', 'News added')
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
        })
}

// News edit create on POST
exports.editNews = function(req, res) {
    const news = {}
    news.title = req.body.title
    news.author = req.user._id
    news.body = req.body.body

    let query = {_id:req.params.id}

    News.updateOne(query, news, function(err) {
        if(err){
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
}

// Delete news on POST
exports.deleteNews = function(req, res, next) {
    News.findById(req.params.id, function(err, news) {
        if (err) return next(err)
        news.remove()

        req.flash('success', 'News deleted')
        res.redirect('/')
    })
}

// Add news on GET
exports.getAddNews = function (req, res) {
    res.render('NewsViews/add_news'), {
        title: 'Add news'
    }
}

// Edit news on GET
exports.getEditNews = function(req, res) {
    News.findById(req.params.id, function(news) {
        res.render('NewsViews/edit_news', {
            title: 'Edit news',
            news: news
        })
    })
}

// Single news on GET
exports.getNews = function(req, res) {
    News.findById(req.params.id)
        .populate('comments')
        .lean()
        .then(news => res.render('NewsViews/news', { 
            news
        }))
        .catch((err) => {
            console.log(err.message)
    })
}