const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const  User  = require('../server/models/user');
const  dotenv = require('dotenv');

dotenv.config();

function initializePassport() {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (_id, done) => {
    try {
      // Busca al usuario por su ID (campo _id)
      const user = await User.findById(_id);
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
        console.log(profile);
        const { id, displayName, emails } = profile;

        try {
          // Verifica si el usuario ya existe en la base de datos
          const existingUser = await User.findOne({ googleId: id });

          if (existingUser) {
            // Actualiza la información del usuario si es necesario
            existingUser.displayName = displayName;
            existingUser.email = emails[0].value;
            existingUser.token = accessToken;
            await existingUser.save();

            // Devuelve el usuario actualizado
            return done(null, { ...existingUser.toObject(), accessToken });
          } else {
            // Crea un nuevo usuario en la base de datos
            const newUser = await User.create({
              googleId: id,
              displayName,
              email: emails[0].value,
              token: accessToken,
            });

            // Devuelve el nuevo usuario creado
            return done(null, { ...newUser.toObject(), accessToken });
            
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
