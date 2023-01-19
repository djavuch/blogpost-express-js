const express = require('express')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const passport = require('passport')
const methodOverride = require('method-override')
const connectMongooseToDB = require('./config/database')

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//Init App
const app = express()
const port = 3000

//Connection to DB
connectMongooseToDB(process.env.MONGO_URI)

const store = MongoStore.create({ mongoUrl: process.env.MONGO_URI, touchAfter: 24 * 60 * 60 });

app.use(session({
    store: store,
    secret: 'boooom',
    resave: false,
    saveUninitialized: false,
    cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
}))

//Load View Engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json())

// Passport config
require('./configs/passport-config')

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Method override
app.use(methodOverride('_method'))

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

const NewsCategory = require('./models/NewsCategory')

// To show categories on all pages
NewsCategory.find((err, categories) => {
    if (err) { 
        console.log(err)
    } else {
        app.locals.categories = categories
    }
})

//Favicons & node_modules folders
app.use('/dist/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // bootstrap css
app.use('/dist/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))  // bootstrap js
app.use('/dist/umd', express.static(__dirname + '/node_modules/popper.js/dist/umd')) // popper
app.use('/dist/jquery', express.static(__dirname + '/node_modules/jquery/dist')) // jquery
app.use('/dist/pace-js', express.static(__dirname + '/node_modules/pace-js')) // pace-js
app.use('/dist/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/css')) // fontawesome
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))
app.use('/assets', express.static('assets')) 
app.use('/css', express.static('css')) 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/public', express.static(path.join(__dirname, 'public')))

// Flash-express
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next()
})

// Route file
let main = require('./routes/main')
let articles = require('./routes/articles')
let users = require('./routes/users')
let news = require('./routes/news')
let admin = require('./routes/adminRoute')

// Mount routes
app.use('/', main)
app.use('/articles', articles)
app.use('/users', users)
app.use('/news', news)
app.use('/admin', admin)

//Error handler
app.use(function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('Something wrong')
})

// Error 404
app.use((req, res, next) => {
    res.status(404).render('404')
})

// Start server
app.listen(port, () => 
    console.log(`App listening on port ${port}`))