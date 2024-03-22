import multer from "multer";
 

const storage  = multer.diskStorage({
    destination :  function (req, file, cb) {
        cb(null, "./public/temp")
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname)
      }
})

export const upload = multer(
    {
        // storage : storage  
        storage   //dono same raha toh yeh syntax use kar sakte hai 
    }
)