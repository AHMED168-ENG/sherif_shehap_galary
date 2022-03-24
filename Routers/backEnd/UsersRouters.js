const { showUserController, addUser_controller_get, addUser_controller_post, editUser_controller_get, editUser_controller_post, delete_user, chang_actvity_user_controller, allVendoers, activeUser } = require("../../Controller/backEnd/users_controller");
const { uploade_img_multi_fild } = require("../../Helper/helper");
const router = require("express").Router();
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const {usersValidation} = require("../../validations/backEnd/usersValidation")




router.get("/" , isAuthonticate ,  showUserController);
router.get("/addUsers" , isAuthonticate ,  addUser_controller_get);
router.post("/addUsers" , isAuthonticate ,  uploade_img_multi_fild([

    {
        name : "vendoerImage",
    },
    {
        name : "image",
    },
    {
        name : "CommercialRegister",
    },
], "public/admin/asset/images/users_photo") , usersValidation() ,  addUser_controller_post);
router.get("/editUser/:id" , isAuthonticate ,  editUser_controller_get);
router.post("/editUser/:id" , isAuthonticate ,  uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "CommercialRegister",
    },
    {
        name : "vendoerImage",
    }
], "public/admin/asset/images/users_photo") , usersValidation() ,  editUser_controller_post);
router.get("/Vendoers" , isAuthonticate ,  allVendoers);
router.get("/userActevity/:id" , isAuthonticate ,  activeUser);
router.post("/deleteUser/:id" , isAuthonticate ,  delete_user);










module.exports = {
    UsersRouters : router
}