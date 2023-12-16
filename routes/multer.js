const multer = require("multer")
const crypto = require("crypto")
const path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const filename = crypto.randomBytes(20).toString("hex")
      cb(null, file.fieldname+"-" + Date.now() + path.extname(file.originalname))
    }
  })
  