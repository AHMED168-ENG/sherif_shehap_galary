const { signUp_controller_get , signUp_controller_post, activeUserPage, signIn_controller_get, signIn_controller_post, signOut } = require("../../../Controller/frontEnd/auth/auth_controller");
const { uploade_img } = require("../../../Helper/helper");
const { userAuthonticat } = require("../../../middel_ware/frontEnd/userAuthonticate");
const { userNotAuthonticat } = require("../../../middel_ware/frontEnd/usernotAuthonticat");
const { signUp_validation, signInValidation } = require("../../../validations/frontEnd/auth_validation");

var router = require("express").Router();


router.get("/signUp" , userNotAuthonticat , signUp_controller_get)
router.post("/signUp" , userNotAuthonticat , uploade_img("public/admin/asset/images/users_photo" , "image") , signUp_validation()  , signUp_controller_post)
router.get("/signIn" , userNotAuthonticat , signIn_controller_get)
router.post("/signIn" , userNotAuthonticat , signInValidation() , signIn_controller_post)
router.get("/activeUserPage/:id" , userNotAuthonticat , activeUserPage)
router.post("/signOut" , userAuthonticat , signOut)








module.exports = {
    auth_front_router : router
}