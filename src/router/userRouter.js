const express = require('express');
const upload = require('../util/upload.js')
const controller = require("../controller/userController.js")
const router = express.Router();
const { createAccountValidator, loginValidator } = require('../util/userValidator.js');

router.get("/", controller.getNavbarInfo);
router.get("/edit/:username", controller.getAccount);
router.get("*", controller.invalidPage);

router.post("/login", loginValidator, controller.loginAccount);
router.post("/logout", controller.logoutAccount);
router.post("/register", createAccountValidator, controller.createAccount);

router.put("/edit/:username", upload, controller.editAccount);

router.delete('/edit/:username', controller.deleteAccount);

module.exports = router;
