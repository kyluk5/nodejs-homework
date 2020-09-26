const path = require("path");
const { promises: fsPromises } = require("fs");
const multer = require("multer");
const Jimp = require("jimp");

const storage = multer.diskStorage({
  destination: "tmp",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

exports.updateImage = upload.single("avatar");

exports.minimizeImage = async (req, res, next) => {
  const { file } = req;

  const imagePromise = await Jimp.read(file.path);
  await imagePromise
    .quality(50)
    .write(path.join(__dirname, "../../public/images", file.filename));

  fsPromises.unlink(file.path);

  next();
};
