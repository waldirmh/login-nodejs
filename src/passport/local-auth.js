// usamos el modulo passport

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// jalamos a user.js
const User = require("../models/user");

// recibe un usuario para guardarlo para que otras paginas no pidan
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// verifico el id para darselo a otro navegador para que el user se autentique
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    }, // para que se registre el usuario

    // --> LOGICA
    async (req, email, password, done) => {
      try {
        //validamos al usuario
        const user = await User.findOne({ email: email });
        if (user) {
          return done(
            null,
            false,
            req.flash("signupMessage", "THE Email is already taken")
          );
        } else {
          const newUser = new User();
          newUser.email = email;
          newUser.password = newUser.encryptPassword(password); // aqui lo encripta
          await newUser.save(); // cuando termine de guardarlo continue con la sgte linea
          return done(
            null,
            false,
            newUser,
            req.flash("signupMessageRegister", "New Registered User")
          );
          // done(null, newUser,req.flash("signupMessage","New Registered User")); // termina el proceso y me da los datos del usuario autenticado
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          // si no existe el correo
          console.log(" no existe correo")
          return done(null, false, req.flash("loginMessage", "No user found"));
        }
        if (!user.comparePassword(password)) {

          console.log(" password incorrect")
          return done(
            null,
            false,
            req.flash("loginMessage", "Incorrect Password")
          );
        }
        done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);
