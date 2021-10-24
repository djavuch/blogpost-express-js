const multer = require('multer')
const path = require('path')
const {GridFsStorage} = require("multer-gridfs-storage")

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"]

        if(match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}_${file.originalname}`
            return filename
        }
        
        return {
            bucketName: "avatars",
            filename: `${Date.now()}_${file.originalname}`
        }
    }
})

// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 2
//     },
//     fileFilter: fileFilter
// })

module.exports = multer({ storage : storage })