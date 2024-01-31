const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const { CLOUDINARY_API_KEY, CLOUDINARY_PASSWORD, CLOUDINARY_NAME } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_PASSWORD,
  secure: true,
});

module.exports = cloudinary;