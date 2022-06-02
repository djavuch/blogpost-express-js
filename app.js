if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const pug = require('pug')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')
const connectMongooseToDB = require('./config/database')

//Connection to DB
connectMongooseToDB(process.env.MONGO_URI)

//Init App
const app = express()
const port = 3000

//Bring in Models
const Article = require('./models/article')
const User  = require('./models/user')
const News = require('./models/news')

//Load View Engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json())

// Express Session Middleware
app.use(
    session({
        secret: 'boooom',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/firstblog' }),
        cookie: { maxAge: 600 * 10000 } // 1 hour
}))

// Method override
app.use(methodOverride('_method'))

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
app.use('/dist/umd', express.static(__dirname + '/node_modules/popper.js/dist/umd')) // popper
app.use('/dist/jquery', express.static(__dirname + '/node_modules/jquery/dist')) // jquery
app.use('/dist/pace-js', express.static(__dirname + '/node_modules/pace-js')) // pace-js
app.use('/dist/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/css'))
app.use('/assets', express.static('assets')) 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Flash-express
app.use(flash())

//Home Route
app.get('/', function(req, res) {
    const { page } = req.query
    const options = {
        page: parseInt(page, 10) || 1,
        limit: 10
    }

    Article.paginate({}, options).then((articles, err) => {
        News.paginate({}, options).then((newswire, err) => {
            if(!err) {
                res.render('index', {
                    title: 'Articles',
                    newswire: newswire.docs,
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
})

// Route files
let articles = require('./routes/articles')
let users = require('./routes/users')
let news = require('./routes/news')
let admin = require('./routes/admin')

// Mount routes
app.use('/articles', articles)
app.use('/users', users)
app.use('/news', news)
app.use('/admin', admin)

//Error handler
app.use(function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('Something wrong')
})

// Start server
app.listen(port, () => console.log(`App listening on port ${port}`))