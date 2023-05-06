tinymce.init({
  selector: 'textarea#my-expressjs-tinymce-app',
  plugins: 'lists link image table code help wordcount',
  toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image'
  // images_upload_url: '/admin/news/upload',
  // automatic_uploads: true,

  // images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {

  //   const xhr = new XMLHttpRequest()
  //   xhr.withCredentials = false
  //   xhr.open('POST', '/admin/news/upload')

  //   xhr.upload.onprogress = (e) => {
  //       progress(e.loaded / e.total * 100)
  //   }

  //   xhr.onload = () => {
  //     if (xhr.status === 403) {
  //         reject({ message: 'HTTP Error: ' + xhr.status, remove: true })
  //         return
  //     }

  //     if (xhr.status < 200 || xhr.status >= 300) {
  //         reject('HTTP Error: ' + xhr.status)
  //         return
  //     }

  //     const json = JSON.parse(xhr.responseText);

  //     if (!json || typeof json.location != 'string') {
  //         reject('Invalid JSON: ' + xhr.responseText)
  //         return
  //     }

  //     resolve(json.location)
  //   }

  //   xhr.onerror = () => {
  //     reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
  //   }

  //   const formData = new FormData()
  //   formData.append('images', blobInfo.blob(), blobInfo.filename())

  //   xhr.send(formData)

  // })
})