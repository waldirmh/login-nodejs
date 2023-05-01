//  SEVER FILES
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const sesion = require("express-session");
const flash = require("connect-flash");

// const passport = require("passport");

// INITIALIZATIONS
const app = express();

// INITIALIZATIONS DATA BASE

require("./database");
require("./passport/local-auth");


// SETTINGS

app.set("views", path.join(__dirname, "views")); // me llama la ruta views
app.use(express.static(path.join(__dirname, "public"))); //  public folder

app.engine("ejs", engine); // es el motor de plantillas
app.set("view engine", "ejs"); // sirve para validar los views del fronted
app.set("port", process.env.PORT || 5000);

//  MIDDLEWARES

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); // me permite capturar datos del cliente

// START SESION
app.use(
  sesion({
    secret: "myscretsession",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash()); // declaramos el paquete flash
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signupMessage = req.flash("signupMessage");
  app.locals.signupMessageRegister = req.flash("signupMessageRegister");
  app.locals.loginMessage = req.flash("loginMessage");
  app.locals.user = req.user;
  next();
});

// ROUTES
app.use("/", require("./routes/index"));

// START THE SERVER
app.listen(app.get("port"), () => {
  console.log("server on port ", app.get("port"));
});
