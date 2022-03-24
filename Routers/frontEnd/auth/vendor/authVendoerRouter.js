const { signUp_controller_get, signUp_controller_post, signIn_controller_get, signIn_controller_post, activeUserPage, signOut } = require("../../../../Controller/frontEnd/vendoer/auth/authVendoerController");
const { uploade_img_multi_fild } = require("../../../../Helper/helper");
const { userAuthonticat } = require("../../../../middel_ware/frontEnd/userAuthonticate");
const { vendoerAuthonticat } = require("../../../../middel_ware/frontEnd/vendoer/AuthonticateVendoer");
const { vendoerNotAuthonticat } = require("../../../../middel_ware/frontEnd/vendoer/notAuthonticatVendoer");
const { signUpVendoerValidation, signInVendoerValidation } = require("../../../../validations/frontEnd/vendoer/authVendoer");

var router = require("express").Router();

router.get("/signUp" , userAuthonticat , vendoerNotAuthonticat ,  signUp_controller_get);
router.post("/signUp" , userAuthonticat , vendoerNotAuthonticat , uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "CommercialRegister",
    },
], "public/admin/asset/images/users_photo") , signUpVendoerValidation() , signUp_controller_post );

router.get("/signIn" , userAuthonticat , vendoerNotAuthonticat , signIn_controller_get);
router.post("/signIn" , userAuthonticat , vendoerNotAuthonticat , signInVendoerValidation() , signIn_controller_post);

router.get("/activeUserPage/:id" , userAuthonticat , vendoerNotAuthonticat , activeUserPage);
router.post("/signOut" , userAuthonticat , vendoerAuthonticat , signOut);



module.exports = {
    authVendorRouter : router
}