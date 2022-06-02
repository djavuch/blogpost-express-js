const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Article = require('../models/article')
const News = require('../models/news')
const User = require('../models/user')
const Comment = require('../models/comment')

router.get('/', (req, res) => {
    res.render('AdminPanel/index', {
    title: 'Admin'
    })
})

module.exports = router;