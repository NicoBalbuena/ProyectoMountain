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
const cloudinary = require("./middleware/cloudinary-middleware");
const nodemailer = require('nodemailer');

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
  })
);

app.use("/mp", mercadopagoRoutes);
app.use("/auth", authRouter);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {

    res.json("test ok")
})


//config del nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
app.post("/register",async (req,res)=>{
    try {
        const{nameGoogle,emailGoogle}=req.body;

        const userDoc=await User.create({
            nameGoogle,
            emailGoogle
    }) 
    // funcion para enviar el email de bienvenida
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailGoogle,
        subject: '¡Bienvenido a Mountain Haven - Tu Refugio en la Montaña!',
        text: `Hola ${nameGoogle},\n\n¡Bienvenido a Mountain Haven!\n\n
        Estamos encantados de darte la bienvenida a nuestra comunidad de amantes de la naturaleza y aventureros. En Mountain Haven, nos dedicamos a proporcionar experiencias excepcionales en alojamientos encantadores, perfectos para tu escapada a la montaña.\n\nGracias por unirte a nosotros. Tu próximo viaje está a punto de comenzar, y estamos emocionados de ser parte de tus experiencias en la montaña.\n\n
        Ya sea que busques la comodidad de una cabaña acogedora o la vista panorámica desde una suite de lujo, en Mountain Haven encontrarás el refugio perfecto para tus momentos especiales.\n\nSi necesitas ayuda para planificar tu estancia o tienes alguna pregunta, nuestro equipo está aquí para ayudarte. Explora nuestras opciones de alojamiento y descubre la magia que Mountain Haven tiene reservada para ti.\n\n
        ¡Esperamos que disfrutes de tu estancia en nuestro refugio en la montaña!\n\n
        Saludos cordiales,\n\n
        El equipo de Mountain Haven`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado exitosamente:', info.response);
        }
    });

    res.status(201).json(userDoc);
} catch (error) {
    res.status(422).json({ error: error.message });
}
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

       
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });

        // funcion para enviar el email de bienvenida
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '¡Bienvenido a Mountain Haven - Tu Refugio en la Montaña!',
            text: `Hola ${name},\n\n¡Bienvenido a Mountain Haven!\n\n
            Estamos encantados de darte la bienvenida a nuestra comunidad de amantes de la naturaleza y aventureros. En Mountain Haven, nos dedicamos a proporcionar experiencias excepcionales en alojamientos encantadores, perfectos para tu escapada a la montaña.\n\nGracias por unirte a nosotros. Tu próximo viaje está a punto de comenzar, y estamos emocionados de ser parte de tus experiencias en la montaña.\n\n
            Ya sea que busques la comodidad de una cabaña acogedora o la vista panorámica desde una suite de lujo, en Mountain Haven encontrarás el refugio perfecto para tus momentos especiales.\n\nSi necesitas ayuda para planificar tu estancia o tienes alguna pregunta, nuestro equipo está aquí para ayudarte. Explora nuestras opciones de alojamiento y descubre la magia que Mountain Haven tiene reservada para ti.\n\n
            ¡Esperamos que disfrutes de tu estancia en nuestro refugio en la montaña!\n\n
            Saludos cordiales,\n\n
            El equipo de Mountain Haven`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
            } else {
                console.log('Correo electrónico enviado exitosamente:', info.response);
            }
        });

        res.status(201).json(userDoc);
    } catch (error) {
        res.status(422).json({ error: error.message });
    }

  res.json("test ok");

});

app.post("/register", registerAndEmail);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
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

const photosMiddleware = multer({ dest: "uploads/" });
app.post(
  "/upload",
  photosMiddleware.array("photos", 100),
  cloudinary,
  (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = "uploads/" + Date.now() + "." + ext; // Nueva ruta sin la barra invertida
      fs.copyFileSync(path, newPath);
      fs.unlinkSync(path); // Elimina el archivo original
      uploadedFiles.push(newPath.replace("uploads/", ""));
    }
    res.json(uploadedFiles);
  }
);

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
    checkIn,
    checkOut,
    guests,
    price,
  } = data;
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
      checkIn,
      checkOut,
      guests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
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
    checkIn,
    checkOut,
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
        checkIn,
        checkOut,
        guests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  try {
    const { token } = req.cookies;
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
      req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const bookingDoc = await Booking.create({
        place,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price,
        user: userData.id,
      });
      res.json(bookingDoc);
    });
  } catch (error) {
    res.status(404).json("error");
  }
});

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
      const bookings = await Booking.find({ user: id }).populate("place");
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.post("/places/:placeId/reviews", reviewController.createReview);
app.get("/places/:placeId/reviews", reviewController.getReviewsByPlace);
// app.get("/places/:placeId", getPlaceById);

app.listen(4000, () => {
  console.log("Conectado ponete a codear");
});
