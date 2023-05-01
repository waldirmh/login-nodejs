require("dotenv").config();
module.exports = {
  mongodb: {
    URI: process.env.MONGO_URI,
  },
};
