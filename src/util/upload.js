const util = require("util");
const multer = require("multer");
const { env } = require("./../configs/server.config");
const { GridFsStorage } = require("multer-gridfs-storage");

const uri = env === 'prod'? process.env.ATLAS_URI : 'mongodb://127.0.0.1:27017/hitorigoto';

const storage = new GridFsStorage({
  url: uri,
  options: { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  },
  file: (req, file) => {
    const imageTypes = ["image/png", "image/jpeg"];

    if (imageTypes.includes(file.mimetype)) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "profile_img",
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

const uploadFiles = multer({ storage }).single("profileimg");
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;