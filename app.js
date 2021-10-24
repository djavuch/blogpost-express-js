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
const mongoDatabase = require('./config/database')
const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

// Route files
let articles = require('./routes/articles')
let users = require('./routes/users')
let adminRouter = require('./routes/admin.route')

//Connection to DB
mongoDatabase()

//Init App
const app = express()
const port = 3000

//Bring in Models
const Article = require('./models/article')
const User  = require('./models/user')
const { read } = require('@popperjs/core')

//Load View Engine 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use('/admin', adminRouter)

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
        cookie: { maxAge: 60 * 10000 } // 1 hour
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
app.use('/dist/umd', express.static(__dirname + '/node_modules/@popperjs/core/dist/umd')) // popper
app.use('/dist/jquery', express.static(__dirname + '/node_modules/jquery/dist')) // jquery
app.use('/dist/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/css'))
app.use('/assets', express.static('assets')) 
app.use('/uploads', express.static(path.join()));

// Flash-express
app.use(flash())

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

// // Admin Route
// AdminBro.registerAdapter(AdminBroMongoose)

// const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

// const canEditArticle = ({ currentAdmin, record }) => {
//     return currentAdmin && (currentAdmin.role === 'admin' 
//     || currentAdmin._id === record.param('ownerId'))
// }

// const adminBro = new AdminBro({
//     resource: [{User,
//         options: { 
//             properties: {
//                 encryptedPassword: {
//                     isVisible: false,
//                 },
//                 password: {
//                     type: 'string',
//                     isVisible: {
//                         list: false, edit: true, filter: false, show: false,
//                     },
//                 },
//             },
//             actions: {
//                 new: {
//                     before: async (request) => {
//                         if(request.payload.record.password) {
//                             request.payload.record = {
//                                 ...request.payload.record,
//                                 encryptedPassword: await bcrypt.hash(request.payload.record.password, 10),
//                                 password: undefined,
//                             }
//                         }
//                         return request
//                     },
//                 },
//                 edit: {isAccessible: canModifyUsers},
//                 delete: {isAccessible: canModifyUsers},
//                 new: {isAccessible: canModifyUsers},
//             }
//         }
//     },
//     {
//         resource: Article,
//         options: {
//             properties: {
//                 ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
//             },
//             actions: {
//                 edit: { isAccessible: canEditArticle },
//                 delete: { isAccessible: canEditArticle},
//                 new: {
//                     before: async (request, { currentAdmin }) => {
//                         request.payload.record = {
//                             ...request.payload.record,
//                             ownerId: currentAdmin._id,
//                         }
//                         return request
//                     }
//                 }
//             }
//         }
//     }
// ],
//     rootPath: '/admin'
// })

// const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
//     authenticate: async (username, password) => {
//         const user = await User.findOne({ username })
//         if (user) {
//             const matched = await bcrypt.compare(password, user.encryptedPassword)
//             if (matched) {
//                 return user
//             }
//         }
//         return false
//     },
//     cookiePassword: 'some-secret-password-used-to-secure-cookie',
// })

// app.use(adminBro.options.rootPath, router)

// Mount routes
app.use('/articles', articles)
app.use('/users', users)

// Start server
app.listen(port, () => console.log(`App listening on port ${port}`))