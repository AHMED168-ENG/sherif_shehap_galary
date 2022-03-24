const router = require("express").Router();
const { addCatigorys_controller_get, editCatigorys_controller_get, deleteCatigorys_controller, showCatigorys_controller, addCatigorys_controller_post, editCatigorys_controller_post, active_Catigorys_controller } = require("../../Controller/backEnd/catigorys_controller");
const { uploade_img, uploade_multiapl_img, uploade_img_multi_fild } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const db = require("../../models");
const { catigoryValidation } = require("../../validations/backEnd/catigorys.validation");


router.get("/" , isAuthonticate , showCatigorys_controller);


router.get("/addcatigory" , isAuthonticate , addCatigorys_controller_get);


router.post("/addcatigory" , isAuthonticate , uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "slug",
    }
] , "public/admin/asset/images/categoris_photo") , catigoryValidation() , addCatigorys_controller_post);


router.get("/editCatigory/:id" , isAuthonticate , editCatigorys_controller_get);
router.post("/editCatigory/:id" , isAuthonticate , uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "slug",
    }
] , "public/admin/asset/images/categoris_photo") , catigoryValidation() , editCatigorys_controller_post);

router.post("/deleteCatigory/:id" , isAuthonticate , deleteCatigorys_controller);
router.get("/activeCatigory/:id" , isAuthonticate , active_Catigorys_controller);





router.get("/test" , async (req , res) => {

});













module.exports = {
    catigorysRouter : router
}