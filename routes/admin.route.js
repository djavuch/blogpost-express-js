const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const mongoDatabase = require('../config/database')
const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

//Connection to DB
mongoDatabase()

//Bring in Models
let Article = require('../models/article')
let User  = require('../models/user')

// Admin Route
AdminBro.registerAdapter(AdminBroMongoose)

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
//     dashboard: {
//         handler: async () => {
//             return { some: 'output' }
//         },
//         component: AdminBro.bundle('../custom_dashboard/login_page.jsx')
//     },
//     rootPath: '/admin'
// })

// // const router = AdminBroExpressjs.buildRouter(adminBro)

// const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
//     authenticate: async (username, password) => {
//         const user = await User.findOne({ username })
//         if (user) {
//             const matched = await bcrypt.compare(password, user.password)
//             if (matched) {
//                 return user
//             }
//         }
//         return false
//     },
//     cookiePassword: 'some-secret-password-used-to-secure-cookie',
// })

const adminBro = new AdminBro({
    databases: [mongoose],
    rootPath: '/admin'
})

const router = AdminBroExpressjs.buildRouter(adminBro)

module.exports = router