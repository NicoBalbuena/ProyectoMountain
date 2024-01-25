const cloudinary = require("../utils/cloudinary-config");

async function cloudinaryMiddleware(req, res, next) {
  try {
    if (!req.body.data.photos) {
      return res.status(404).json({ Message: "Image not found" });
    }

    const uploadPromises = req.body.data.photos.map(async (photoUrl) => {
      const result = await cloudinary.uploader.upload(photoUrl, {
        upload_preset: "ml_default",
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
      });

      return result.secure_url;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    req.body.data.photos = uploadedImages;
    next();
  } catch (error) {
    console.error(error);
    throw new Error({ Error: error });
  }
}

module.exports = cloudinaryMiddleware;
