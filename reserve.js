//Home Route
app.get('/', function(req, res) {
    const { page } = req.query
    const options = {
        page: parseInt(page, 10) || 1,
        limit: 3
    }

    Article.paginate({}, options).then((articles, err) => {
        if(!err) {
            res.render('index', {
                title: 'Articles',
                articles: articles.docs,
                hasNextPage: articles.hasNextPage,
                hasPrevPage: articles.hasPrevPage,
                currentPage: articles.page, 
                totalPages: articles.totalPages,
                pagingCounter: articles.pagingCounter
            })
        }
    })
})