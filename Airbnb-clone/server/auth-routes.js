const { Router } = require("express");
const passport = require("passport");
const User = require("./models/user");

const authRouter = Router();

// Rutas de autenticación con Google
authRouter.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/login/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Aquí podrías realizar acciones adicionales si es necesario
        console.log('Perfil del usuario autenticado:', req.user);
        // Redirección exitosa después de la autenticación con Google
        res.redirect('http://localhost:5173/');
    }
);

// Ruta de registro con Google
authRouter.post('/register/google', async (req, res) => {
    const { nameGoogle, emailGoogle } = req.body;

    try {
        // Verificar si el usuario ya existe en la base de datos
        let user = await User.findOne({ email: emailGoogle });

        if (!user) {
            // Si el usuario no existe, y el emailGoogle no es null, crear uno nuevo
            if (emailGoogle) {
                user = await User.create({
                    name: nameGoogle,
                    email: emailGoogle,
                });
            } else {
                return res.status(422).json({ error: 'El campo emailGoogle no puede ser nulo' });
            }
        }

        // Logs adicionales
        console.log('Usuario creado o encontrado con éxito');
        console.log('Información del usuario:', user);

        // Iniciar sesión del usuario
        req.login(user, (err) => {
            if (err) {
                console.error('Error al iniciar sesión:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            // Devolver la información del usuario autenticado
            return res.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email,
            });
        });
    } catch (error) {
        console.error('Error durante el registro con Google:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = authRouter;
