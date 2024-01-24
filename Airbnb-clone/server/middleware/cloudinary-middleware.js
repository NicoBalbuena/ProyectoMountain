const cloudinary = require("../utils/cloudinary-config");

async function cloudinaryMiddleware(req, res, next) {
  if (!req.body.photos)
    return res.status(404).json({ Message: "Image not found" });
  try {
    await cloudinary.uploader.upload(
      req.body.photos,
      {
        upload_preset: "unsigned_preset",
        allowed_formats: [
          "png",
          "jpg",
          "jpeg",
          "svg",
          "ico",
          "jfif",
          "png",
          "webp",
        ],
      },
      (err, result) => {
        if (err) console.error(err);
        req.body.image = result.secure_url;
      }
    );
    next();
  } catch (error) {
    console.error(error);
    throw new Error({ Error: error });
  }
}
module.exports = cloudinaryMiddleware;
