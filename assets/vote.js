$(document).ready(function() {
    $('.like').submit(function(e) {
        e.preventDefault()

        const commentId = $(this).data('id')
        const newsId = $(this).data('id')
        $.ajax({
            type: 'PUT',
            url:  newsId + '/comments/' + commentId + '/like',
            success: function(data) {
                console.log('voted up!')
            },
        error: function(err) {
            console.log(err.messsage)
        }
    })
})

    $('.dislike').submit(function(e) {
        e.preventDefault()

        const commentId = $(this).data('id')
        const newsId = $(this).data('id')
        $.ajax({
            type: 'PUT',
            url: newsId + '/comments/' + commentId + '/dislike',
            success: function(data) {
                console.log('voted down!')
            },
            error: function(err) {
                console.log(err.messsage)
            }
        })
    })
})