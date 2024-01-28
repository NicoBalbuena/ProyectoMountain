const cloudinary = require("../utils/cloudinary-config");

async function cloudinaryMiddleware(req, res, next) {
  try {
    let photos;
    // Verificar si las fotos están en el cuerpo como JSON
    if (req.body.data && req.body.data.photos) {
      photos = req.body.data.photos;
    }

    // Si no se encontraron fotos en formato JSON, verificar si están en formato form
    if (!photos && req.files && req.files.length > 0) {
      // Obtener las URLs de las fotos desde los archivos subidos
      photos = req.files.map((file) => file.path);
    }

    // Si no hay fotos, devolver un error
    if (!photos || photos.length === 0) {
      return res.status(404).json({ Message: "Image not found" });
    }

    // Subir las fotos a Cloudinary
    const uploadPromises = photos.map(async (photo) => {
      const result = await cloudinary.uploader.upload(photo, {
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

    // Actualizar las fotos en el cuerpo de la solicitud
    if (req.body.data) {
      req.body.data.photos = uploadedImages;
    } else {
      req.body.photos = uploadedImages;
    }

    next();
  } catch (error) {
    console.error(error);
    throw new Error({ Error: error });
  }
}

module.exports = cloudinaryMiddleware;
