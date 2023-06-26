const express = require('express');
const { body } = require('express-validator');
const controller = require("../controller/adminController.js")
const router = express.Router();

const checkEmail = () => body('email').isEmail().notEmpty();

router.get("/", controller.getUserAccount);

router.post(
  "/register", 
  checkEmail(), 
  body('password').isStrongPassword({ minLength: 6, minSymbols: 0, minUppercase: 0 }), 
  controller.createAccount);

router.post(
  "/login", 
  checkEmail(),
  body('password').notEmpty(),
  controller.loginAccount);
  
router.post("/logout", controller.logoutAccount);

router.delete("/account", controller.deleteAccount);

module.exports = router;
