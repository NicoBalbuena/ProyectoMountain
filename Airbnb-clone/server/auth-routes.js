const { Router } = require("express");
const passport = require("passport");


const authRouter = Router();

// Rutas de autenticación con Google
authRouter.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email']},(req, res)=>{
  console.log("loginGoogle", req.user.token)
  res.send(req.user.token)
}));

// console.log('Ruta de autenticación de Google registrada: /login/auth/google');

authRouter.get('/login/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('Perfil del usuario autenticado:', req.user);
    // Redirección exitosa después de la autenticación con Google
    res.send(req.user.accessToken);
  }
);

module.exports = authRouter;
