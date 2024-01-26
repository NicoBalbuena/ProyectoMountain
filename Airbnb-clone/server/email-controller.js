require("dotenv").config()
const User = require("./models/user")
const bcrypt = require("bcryptjs")
const bcryptSalt = bcrypt.genSaltSync(10)
const nodemailer = require('nodemailer');


//config del nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const registerAndEmail = async (req, res) => {
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
};

module.exports = { registerAndEmail };