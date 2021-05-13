const express = require('express')
const pug = require('pug')
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/firstblog', { 
    useNewUrlParser: true, useUnifiedTopology: true
})
let db = mongoose.connection

// Check DB connection
db.once('open', function() {
    console.log('Connected to MongoDB')
})

//Check DB errors
db.on('error', function(err) {
    console.log(err)
})

//Init App
const app = express()
const port = 3000

//Bring in Models
let Article = require('./models/article')

//Load View Engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json())
app.use(methodOverride('_method'))

//Favicons & node_modules folders
app.use('/dist/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // bootstrap css
app.use('/dist/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))  // bootstrap js
app.use('/dist/umd', express.static(__dirname + '/node_modules/@popperjs/core/dist/umd')) // popper
app.use('/dist/jquery', express.static(__dirname + '/node_modules/jquery/dist')) // jquery
app.use('/assets', express.static('assets'))

//Home Route
app.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
        if(err){
            console.log(err)
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles    
            })
        }
    })
})

//Get single Article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article: article
        })
    })
})

// Delete Article
app.delete('/article/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//Add Route
app.get('/articles/add', (req, res) => res.render('add_article', {
    title: 'Add Article'
}))

//Load Edit Page
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article:article
        })
    })
})

// Edit Article
app.post('/articles/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    let query = {_id:req.params.id}

    Article.update(query, article, function(err) {
        if(err){
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

    article.save(function(err) {
        if(err){
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
})

app.listen(port, () => console.log(`App listening on port 3000`))