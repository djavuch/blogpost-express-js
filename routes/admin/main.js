const express = require('express')
const adminMainRouter = express.Router()

const AdminMainPage = require('../../controllers/admin/AdminMainPage')

adminMainRouter.get('/', AdminMainPage.mainPage)

module.exports = adminMainRouter