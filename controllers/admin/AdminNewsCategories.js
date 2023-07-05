const NewsCategory = require('../../models/news/NewsCategoryModel')

exports.addNewsCategory = async (req, res) => {
  try {
    const category = new NewsCategory(req.body)

    await category.save()

    req.flash('success', 'Category added.')
    return res.redirect('/admin/news-categories')
  } catch(err) {
    console.log(err)
  }
}

exports.editNewsCategory = async (req, res, next) => {
  try {
    const categoryId = { _id: req.params.categoryId }

    const { name } = req.body

    await NewsCategory.findOneAndUpdate(categoryId, { name }, { new: true })

    req.flash('success', 'Category was changed.')
    return res.redirect('/admin/news-categories')
  } catch (err) {
    console.log(err)
  }
}

exports.deleteNewsCategory = async (req, res) => {
  try {
    const categoryId = { _id: req.params.categoryId }

    const foundCategory = await NewsCategory.findOne({ _id: categoryId })

    if (!foundCategory) {
      req.flash('warning', 'Category not found.')
      return res.redirect('/admin/news-categories')
    }

    await NewsCategory.deleteOne({ _id: categoryId })

    req.flash('info', 'Category was deleted.')
    return res.redirect('/admin/news-categories')
  } catch (err) {
    console.log(err)
  }
}

exports.getAllCategories = async (req, res) => {
  try {
    const listOfCategories = await NewsCategory.find({})

    res.render('admin/news/table-news-categories', {
      title: 'News categories',
      listOfCategories
    })
  } catch (err) {
    console.log(err)
  }
}