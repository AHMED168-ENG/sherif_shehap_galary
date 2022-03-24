const router = require("express").Router();
const { showCarosal_controller , addCarosal_controller_post, addCarosal_controller, editCarosal_controller_get, editCarosal_controller_post, active_Carosals_controller } = require("../../Controller/backEnd/carosals_controller");
const { uploade_img } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const { carosalValidation } = require("../../validations/backEnd/carosals_validation");


router.get("/" , isAuthonticate , showCarosal_controller);
router.get("/addCarosal" , isAuthonticate , addCarosal_controller);
router.post("/addCarosal" , isAuthonticate , uploade_img("public/admin/asset/images/carosals_photo" , "image") , carosalValidation() , addCarosal_controller_post);
router.get("/editCarosal/:id" , isAuthonticate , editCarosal_controller_get);
router.post("/editCarosal/:id" , isAuthonticate , uploade_img("public/admin/asset/images/carosals_photo" , "image") , carosalValidation() , editCarosal_controller_post);
router.get("/activeCarosals/:id" , isAuthonticate , active_Carosals_controller);














module.exports = {
    carosalsRouter : router
}