import multer from "multer";
// multer used to upload files from frontend and it is used as middleware 
// we used diskStorage , check multer docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)  // originalname give full file name
  }
})

export const upload = multer({ storage: storage })