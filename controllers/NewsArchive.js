const News = require('../models/news')

exports.newswireForBlog = function(req, res) {
    const newswireAggregate = News.aggregate([
        {
            $sort: { title: 1 },
        },
    ]) 
    
    const { page } = req.query
    const options = {
        page: parseInt(page, 15) || 1,
        limit: 15
    }

    News.paginate({}, options).then((newswire, err) => {
        if(!err) {
            res.render('NewsViews/newswire', {
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