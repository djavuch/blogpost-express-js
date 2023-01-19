exports.listOfUsers = (req, res) => {
    res.render('admin/table-users', {
        title: 'Users list'
    })
}