const { login_controller_get, login_controller_post, logout_controller } = require("../../../Controller/backEnd/auth/authController");
const { login_validation } = require("../../../validations/backEnd/login_validation");
const { isNotAuthonticate } = require("../../../middel_ware/backEnd/ifNotAuthonticate");
const { isAuthonticate } = require("../../../middel_ware/backEnd/isAuthonticate");

const router = require("express").Router();





router.get("/signIn" , isNotAuthonticate  , login_controller_get)
router.post("/signIn" , isNotAuthonticate , login_validation() , login_controller_post)
router.post("/logOut" , isAuthonticate , logout_controller)







module.exports = {
    authRouter : router
}