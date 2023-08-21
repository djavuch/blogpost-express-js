const express = require('express')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const connectMongooseToDB = require('./configs/database')
const NewsCategory = require('./models/news/NewsCategoryModel')
const NewsPost = require('./models/news/NewsPostModel')
const { ensureAuthenticated, ensureAdmin } = require('./middleware/auth')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//Init App
const app = express()
const port = 3000

//Connection to DB
connectMongooseToDB(process.env.MONGO_URI)

app.use(session({
  secret: process.env.SESSION_SECRET
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 12 * 3600000
  },
  store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

// Passport config
require('./configs/passport-config')

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Load View Engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Method override
app.use(methodOverride('_method'))

app.get('*', async (req, res, next) => {
  res.locals.user = req.user || null
  res.locals.categories = await NewsCategory.find({}) || null
  // display news archive by month
  res.locals.archive =
    await NewsPost.aggregate([
      { $group:
          { _id: { year: { $year: '$created_on' }, month: { $month: '$created_on' } } }
      }]) || null
  next()
})

//Favicons & node_modules folders
app.use('/dist/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // bootstrap css
app.use('/dist/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))  // bootstrap js
app.use('/dist/umd', express.static(__dirname + '/node_modules/popper.js/dist/umd')) // popper
app.use('/dist/jquery', express.static(__dirname + '/node_modules/jquery/dist')) // jquery
app.use('/dist/pace-js', express.static(__dirname + '/node_modules/pace-js')) // pace-js
app.use('/dist/fontawesome', express.static(__dirname + '/node_modules/@fontawesome/fontawesome-free/css')) // fontawesome
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))
app.use('/assets', express.static('assets'))
app.use('/css', express.static('css'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/public', express.static(path.join(__dirname, 'public')))

// Flash-express
app.use(require('express-flash')())

// Mount routes
app.use('/', require('./routes/mainRoute'))
app.use('/articles', require('./routes/articles/articlesRoute'))
app.use('/users', require('./routes/users/usersRoute'))
app.use('/news', require('./routes/news/newsRoute'))
app.use('/admin', ensureAuthenticated, ensureAdmin, require('./routes/admin/adminRoute'))

//Error handler
app.use((err, req, res, next) => {
  res.status(500).send('Something wrong')
  console.log(err.stack)
})

// Error 404
app.use((req, res, next) => {
  res.status(404).render('404')
})

// Start server
app.listen(port, () =>
  console.log(`App listening on port ${port}`))
