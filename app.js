if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const pug = require('pug')
const path = require('path')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('express-flash')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const { check, validationResult } = require('express-validator')
const mongoDatabase = require('./config/database')

//Connection to DB
mongoDatabase()

//Init App
const app = express()
const port = 3000

//Bring in Models
let Article = require('./models/article')
const { read } = require('@popperjs/core')

//Load View Engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json())
app.use(methodOverride('_method'))

// Express Session Middleware
app.use(
    session({
        secret: 'boooom',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/firstblog' }),
        cookie: { maxAge: 60 * 10000 } // 1 hour
    }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
require('./middleware/passport-config')

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//Favicons & node_modules folders
app.use('/dist/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // bootstrap css
app.use('/dist/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))  // bootstrap js
app.use('/dist/umd', express.static(__dirname + '/node_modules/@popperjs/core/dist/umd')) // popper
app.use('/dist/jquery', express.static(__dirname + '/node_modules/jquery/dist')) // jquery
app.use('/assets', express.static('assets'))

// Flash-express
app.use(flash())

//Home Route
app.get('/', function (req, res) {

    const { page } = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: 10
    }

    Article.paginate({}, options).then((articles, err) => {
        if (!err) {
            res.render('index', {
                title: 'Articles',
                articles: articles.docs,
                hasNextPage: articles.hasNextPage,
                hasPrevPage: articles.hasPrevPage,
                currentPage: articles.page, 
                totalPages: articles.totalPages
            })
        }
    })
})

//Get single Article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        })
    })
})

// Delete Article
app.delete('/article/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//Add Route
app.get('/articles/add', (req, res) => res.render('add_article', {
    title: 'Add Article'
}))

//Load Edit Page
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        })
    })
})

// Edit Article
app.post('/articles/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    let query = { _id: req.params.id }

    Article.updateOne(query, article, function (err) {
        if (err) {
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
})

//Add Submit POST
app.post('/articles/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save(function (err) {
        if (err) {
            console.log(err)
            return
        } else {
            req.flash('success', 'Article added')
            res.redirect('/')
        }
    })
})

// Route files
//let articles = require('./routes/articles');
let users = require('./routes/users')
//app.use('/articles', articles);
app.use('/users', users)

// app.get('/data-test', (req, res) => {
//     const now = new Date()
//     console.log(now);
//     res.send('boom')
// })

// Start server
app.listen(port, () => console.log(`App listening on port ${port}`))