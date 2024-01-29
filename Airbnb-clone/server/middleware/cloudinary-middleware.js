const cloudinary = require("../utils/cloudinary-config");

async function cloudinaryMiddleware(req, res, next) {
  try {
    let photos;

    // Verificar si las fotos están en el cuerpo como JSON
    if (req.body.data && req.body.data.photos) {
      photos = req.body.data.photos;
    } else if (req.files && req.files.length > 0) {
      // Verificar si las fotos están en formato form
      photos = req.files.map((file) => file.path);
    }

    // Si no hay fotos, devolver un error
    if (!photos || photos.length === 0) {
      return res
        .status(400)
        .json({ error: "No se encontraron imágenes para cargar" });
    }

    // Subir las fotos a Cloudinary
    const uploadPromises = photos.map(async (photo) => {
      const result = await cloudinary.uploader.upload(photo, {
        upload_preset: "lodgings",
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

        folder: "lodgings",
      });
      console.log("Cloudinary upload result:", result);
      return result.secure_url;
    });

    // Esperar a que se completen todas las cargas de imágenes
    const uploadedImages = await Promise.all(uploadPromises);

    // Actualizar las fotos en el cuerpo de la solicitud
    if (req.body.data) {
      req.body.data.photos = uploadedImages;
    } else {
      req.body.photos = uploadedImages;
    }
    // Llamar al siguiente middleware
    next();
  } catch (error) {
    console.error("Error al cargar imágenes a Cloudinary:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = cloudinaryMiddleware;
