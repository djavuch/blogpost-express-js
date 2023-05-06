const mongoose = require('mongoose')
const News  = require('../../models/news/NewsModel')
const NewsCategory = require('../../models/news/NewsCategoryModel')
const Comment = require('../../models/comment')

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
        limit: 10
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
    const commentPerPage = 1
    const page = (parseInt(req.query.page)) || 1

    try {
        const news = await News.findOne({ slug: req.params.news_slug })
            .populate({
                path: 'comments',
                options: { 
                    skip: (page - 1) * commentPerPage,
                    limit: commentPerPage,
                }
            }).exec()

        const commentCount = await Comment.countDocuments({ newsId: news })
            .exec()

        const pages = Math.ceil(commentCount / commentPerPage)
        const prevPage = page === 1 ? null : page - 1
        const nextPage = page < Math.ceil(commentCount / commentPerPage)

        if (news) {
            // News view counter
            news.incrementViewsCounter()
            return res.render('news/news_body', { 
                news,
                comments: news.comments,
                currentPage: page,
                pages,
                prevPage,
                nextPage
            })
        }
        res.status(404)

    } catch (err) {
        next(err)
    }
}