const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const  User  = require('../server/models/user');
const  dotenv = require('dotenv');

dotenv.config();

function initializePassport() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000/auth/login/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('este es el log de profile:', profile);
        const { id, displayName, emails } = profile;

        try {
          // Verifica si el usuario ya existe en la base de datos
          const existingUser = await User.findOne({ googleId: id });
  
          if (existingUser) {
            // Actualiza la información del usuario si es necesario
            existingUser.displayName = displayName;
            existingUser.email = emails[0].value;
            await existingUser.save();
  
            // Devuelve el usuario actualizado
            return done(null, existingUser);
          } else {
            try {
              // Crea un nuevo usuario en la base de datos
              console.log('Creando nuevo usuario:', profile.id, profile.displayName, profile.emails[0].value);
              const newUser = await User.create({
                googleId: id,
                displayName,
                email: emails[0].value,
              });
              console.log('Nuevo usuario creado:', newUser);
  
              // Devuelve el nuevo usuario creado
              return done(null, newUser);
            } catch (error) {
              console.error('Error al crear nuevo usuario', error);
              return done(error, null);
            }
          }
        } catch (error) {
          console.log(error);
          return done(error, null);
        }
      }
    )
  );
}

module.exports = initializePassport;
