const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/product-images')
    },
    //to give name for image
    filename: function (req, file, cb) {
      const ext = file.originalname.substr(file.originalname.lastIndexOf('.'))
      cb(null, Date.now()+ext)
    }
  })
  
  module.exports.store=multer({ storage: storage })