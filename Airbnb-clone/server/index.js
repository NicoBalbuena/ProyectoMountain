const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
require("dotenv").config();
const User = require("./models/user");
const Place = require("./models/place");
const Booking = require("./models/booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const session = require("express-session");
const mercadopago = require("mercadopago");
//pW7KIz9gFG0Emrw7
const mercadopagoRoutes = require("./payment-routes");
const jwtSecret = "ksdojodksokdmc3";
const authRouter = require("./auth-routes");
const reviewController = require("./review-controller");
const { registerAndEmail } = require("../server/email-controller");
const { deletePlace, deleteUser, deleteBooking, deleteReview } = require("./deleteController.js");
const cloudinary = require("./middleware/cloudinary-middleware");
const nodemailer = require("nodemailer");
const filtros = require("./filtros");


app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const initializePassport = require("./passport");
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 204,
  })
);

// Borrado lógico

app.patch("/places/:id", deletePlace);
app.delete("/bookings/:id", deleteBooking);
app.delete("/places/:placeId/reviews", deleteReview);
app.patch("/users/:id", deleteUser);

// Manejo de errores de conexión a MongoDB

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.use("/mp", mercadopagoRoutes);
app.use("/auth", authRouter);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

//config del nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/register", async (req, res) => {
  try {
    if (req.body.nameGoogle && req.body.emailGoogle) {
      // Registro con Google
      const { nameGoogle, emailGoogle } = req.body;
      const userDoc = await User.create({
        nameGoogle,
        emailGoogle,
      });

      // Enviar correo de bienvenida
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailGoogle,
        subject: "¡Bienvenido a Mountain Haven - Tu Refugio en la Montaña!",
        text: `Hola ${nameGoogle},\n\n¡Bienvenido a Mountain Haven!\n\nEstamos encantados de darte la bienvenida a nuestra comunidad de amantes de la naturaleza y aventureros. En Mountain Haven, nos dedicamos a proporcionar experiencias excepcionales en alojamientos encantadores, perfectos para tu escapada a la montaña.\n\nGracias por unirte a nosotros. Tu próximo viaje está a punto de comenzar, y estamos emocionados de ser parte de tus experiencias en la montaña.\n\nYa sea que busques la comodidad de una cabaña acogedora o la vista panorámica desde una suite de lujo, en Mountain Haven encontrarás el refugio perfecto para tus momentos especiales.\n\nSi necesitas ayuda para planificar tu estancia o tienes alguna pregunta, nuestro equipo está aquí para ayudarte. Explora nuestras opciones de alojamiento y descubre la magia que Mountain Haven tiene reservada para ti.\n\n¡Esperamos que disfrutes de tu estancia en nuestro refugio en la montaña!\n\nSaludos cordiales,\n\nEl equipo de Mountain Haven`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo electrónico:", error);
        } else {
          console.log(
            "Correo electrónico enviado exitosamente:",
            info.response
          );
        }
      });

      res.status(201).json(userDoc);
    } else {
      // Registro con correo y contraseña
      const { name, email, password } = req.body;
      const salt = bcrypt.genSaltSync(10); // Generar un salt
      const hashedPassword = bcrypt.hashSync(password, salt); // Hashear la contraseña con el salt generado
      const userDoc = await User.create({
        name,
        email,
        password: hashedPassword, // Usar la contraseña hasheada
      });

      // Enviar correo de bienvenida
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "¡Bienvenido a Mountain Haven - Tu Refugio en la Montaña!",
        text: `Hola ${name},\n\n¡Bienvenido a Mountain Haven!\n\nEstamos encantados de darte la bienvenida a nuestra comunidad de amantes de la naturaleza y aventureros. En Mountain Haven, nos dedicamos a proporcionar experiencias excepcionales en alojamientos encantadores, perfectos para tu escapada a la montaña.\n\nGracias por unirte a nosotros. Tu próximo viaje está a punto de comenzar, y estamos emocionados de ser parte de tus experiencias en la montaña.\n\nYa sea que busques la comodidad de una cabaña acogedora o la vista panorámica desde una suite de lujo, en Mountain Haven encontrarás el refugio perfecto para tus momentos especiales.\n\nSi necesitas ayuda para planificar tu estancia o tienes alguna pregunta, nuestro equipo está aquí para ayudarte. Explora nuestras opciones de alojamiento y descubre la magia que Mountain Haven tiene reservada para ti.\n\n¡Esperamos que disfrutes de tu estancia en nuestro refugio en la montaña!\n\nSaludos cordiales,\n\nEl equipo de Mountain Haven`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo electrónico:", error);
        } else {
          console.log(
            "Correo electrónico enviado exitosamente:",
            info.response
          );
        }
      });

      res.status(201).json(userDoc);
    }
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

app.post("/register", registerAndEmail);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    if(userDoc.deleted){
      res.status(450).json("DESHABILITADO");
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.status(404).json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, id } = await User.findById(userData.id);
      res.json({ name, email, id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/uploads-by-link", async (req, res) => {
  try {
    const { link } = req.body;

    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    res.status(404).json("error");
  }
});

// Ruta para obtener lugares ordenados por precio ascendente
app.get("/places/sort-by-price-asc", async (req, res) => {
  try {
    console.log("Entrando en la ruta de ordenar por precio ascendente");
    const places = await Place.find().sort({ price: 1 });
    console.log("Lugares obtenidos correctamente:", places);
    res.json(places);
  } catch (error) {
    console.error("Error en la ruta de ordenar por precio ascendente:", error);

    res.status(500).json({
      error: error.message || "Internal Server Error",
      stack: error.stack,
    });
  }
});

// Ruta para obtener lugares ordenados por precio descendente
app.get("/places/sort-by-price-desc", async (req, res) => {
  try {
    console.log("Entrando en la ruta de ordenar por precio descendente");
    const places = await Place.find().sort({ price: -1 });
    console.log("Lugares obtenidos correctamente:", places);
    res.json(places);
  } catch (error) {
    console.error("Error en la ruta de ordenar por precio descendente:", error);

    res.status(500).json({
      error: error.message || "Internal Server Error",
      stack: error.stack,
    });
  }
});

// Ruta para obtener lugares ordenados por cantidad de huéspedes ascendente
app.get("/places/sort-by-guests-asc", async (req, res) => {
  try {
    const places = await Place.find().sort({ guests: 1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ruta para obtener lugares ordenados por cantidad de huéspedes descendente
app.get("/places/sort-by-guests-desc", async (req, res) => {
  try {
    const places = await Place.find().sort({ guests: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ruta para obtener todos las reviews
app.get("/reviews", reviewController.getReviewsAll);

app.post("/places/:placeId/reviews", reviewController.createReview);
app.get("/places/:placeId/reviews", reviewController.getReviewsByPlace);
// Rutas para obtener lugares ordenados por valor de revisión asc y desc

//Rutas para filtros
app.get("/places/by-avg-rating/:avgRating", filtros.getPlacesByAvgRating);
app.get("/places/min-guests/:minGuests", filtros.getPlacesByGuests);
app.get("/places/filter", filtros.getFilteredPlaces)

app.get("/places/sort-by-review-desc",reviewController.getPlacesSortedByReviewDesc);

//uploads
const photosMiddleware = multer({ dest: "uploads/" });
app.post(
  "/upload",
  photosMiddleware.array("photos", 100),
  cloudinary,
  (req, res) => {
    let uploadedFiles = [];
    // Verificar si las fotos están en el cuerpo de la solicitud como URLs de Cloudinary
    if (req.body.data && req.body.data.photos) {
      uploadedFiles = req.body.data.photos;
    } else if (req.body.photos) {
      // Si las fotos están en el cuerpo de la solicitud como URLs de Cloudinary (modo file)
      uploadedFiles = req.body.photos;
    } else {
      // Si las fotos no están en el cuerpo de la solicitud, asumir que están en los archivos cargados
      uploadedFiles = req.files.map((file) => file.path);
    }
    console.log(uploadedFiles);
    res.json(uploadedFiles);
  }
);

//places-post
app.post("/places", cloudinary, (req, res) => {
  const { token } = req.cookies;
  const { data } = req.body;
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    type,
    guests,
    price,
  } = data;
  console.log(photos);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      type,
      guests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      // Manejar el error, por ejemplo, enviar una respuesta de error
      res.status(401).json({ error: "Token no válido" });
      return;
    }

    // userData está definido
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener los detalles del lugar incluyendo las revisiones asociadas, excluyendo _id de las revisiones
    const place = await Place.findById(id).populate({
      path: "reviews",
      select: "-_id -place",
    });

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const { data } = req.body;
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    type,
    guests,
    price,
  } = data;
  const { id } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        type,
        guests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  try {
      const places = await Place.find({deleted: false});
      res.json(places);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/placesAll", async (req, res) => {
  try {
      const places = await Place.find();
      res.json(places);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/bookings", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error("Error verifying JWT:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!userData || !userData.id) {
        return res.status(401).json({ error: "Invalid user data in token" });
      }

      const { id } = userData;

      const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
        req.body;

      const bookingDoc = await Booking.create({
        place,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price,
        user: id,
      });

      res.json(bookingDoc);
    });
  } catch (error) {
    res.status(404).json("error");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users", error)
    return res.status(500).json({message: "Error getting users"})
  }
})

app.get("/users/:id", async (req,res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) return res.status(404).json({message: "User not found"});

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error gettting user by id", error);
    res.status(500).json({message: "Internal Server Error"});
  }
})

app.get("/usersAll", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users", error)
    return res.status(500).json({message: "Error getting users"})
  }
})


app.get("/bookings", async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error("Error verifying JWT:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!userData || !userData.id) {
      return res.status(401).json({ error: "Invalid user data in token" });
    }

    const { id } = userData;

    try {
      const bookings = await Booking.find({ user: id, deleted: false }).populate("place");
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// app.get("/places/:placeId", getPlaceById);

app.listen(4000, () => {
  console.log("Conectado ponete a codear");
});
