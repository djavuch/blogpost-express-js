const mongoose = require('mongoose')
const News  = require('../../models/news')
const NewsCategory = require('../../models/NewsCategory')

// News by category
exports.groupNewsByCategory = async (req, res, next) => {
    try {
        const checkNewsInCategory = await NewsCategory.findOne({ slug: req.params.category_slug })

        if(!checkNewsInCategory) {
            return res.status(404)
        }

        const groupedNews = await News.aggregate([{
            $match: {
                category: mongoose.Types.ObjectId(checkNewsInCategory._id)
            }
        },
        {
            $lookup: {
                from: 'category',
                localField: 'category',
                foreignField: '_id',
                pipeline: [{
                    $project: {
                        _id: 1,
                        title: 1,
                        slug: 1
                    }
                }],
                as: 'category'
            }
        }, 
        {
            $sort: {
                createdAt: -1
            }
        }
    ])
    return res.render('news/news_by_category', {
        groupedNews
    })
    } catch (err) {
        next(err)
    }
}

// All news on GET
exports.newswireForBlog = function(req, res) {
    const newswireAggregate = News.aggregate([
        {
            $sort: { title: 1 },
        },
    ]) 
    
    const { page } = req.query
    const options = {
        page: parseInt(page, 3) || 1,
        limit: 3
    }

    News.paginate({}, options).then((newswire, err) => {
        if(!err) {
            res.render('news/newswire', {
                title: 'Newswire',
                newswire: newswire.docs,
                hasNextPage: newswire.hasNextPage,
                hasPrevPage: newswire.hasPrevPage,
                currentPage: newswire.page, 
                totalPages: newswire.totalPages,
                pagingCounter: newswire.pagingCounter,
                data: {
                    newswireAggregate
                }
            })
        }
    })
}

// Single news on GET
exports.getNews = async (req, res, next) => {
    const news_slug = req.params.slug

    try {
        const news = await News.findOne({ news_slug }).populate('comments')

        if (news) {
            // News view counter
            news.incrementViewsCounter()
            return res.render('news/news_body', { 
                news
            })
        }
        res.status(404)

    } catch (err) {
        next(err)
    }
}