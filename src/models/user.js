// utilizamos los esquemas de mongoose

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
});

// ciframos la contraseña
userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// comparamos la contraseña
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// creamos la coleccion den la base de datos
module.exports = mongoose.model("users", userSchema);
