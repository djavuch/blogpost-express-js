const express = require('express')
const adminMewsCategoriesRouter = express.Router()

// Require controllers
const AdminNewsCategories = require('../../controllers/admin/AdminNewsCategoriesController')

adminMewsCategoriesRouter
  .get('/', AdminNewsCategories.getAllCategories)
  .post('/add', AdminNewsCategories.addNewsCategory)
  .post('/edit/:categoryId', AdminNewsCategories.editNewsCategory)
  .delete('/:categoryId', AdminNewsCategories.deleteNewsCategory)

module.exports = adminMewsCategoriesRouter