require("dotenv").config();
const jwt = require("jsonwebtoken");

const createUserToken = (id) => {
  return jwt.sign({ id }, process.env.USER_TOKEN_KEY, {
    expiresIn: "2h",
  });
}

const createAdminToken = (id) => {
  return jwt.sign({ id }, process.env.ADMIN_TOKEN_KEY, {
    expiresIn: "2h",
  });
}

module.exports =  { createUserToken, createAdminToken };