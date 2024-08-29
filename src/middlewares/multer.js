const multer = require('multer')
const path = require('path')

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)

    if(ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg'){
    return cb(new Error('Formato incorrecto'), false)
    }

    cb(null, true)

  }
})