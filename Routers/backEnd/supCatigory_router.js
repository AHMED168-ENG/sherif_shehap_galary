const router = require("express").Router();
const { show_supCatigory_controller, add_supCatigory_controller_get, get_main_catigory_ajax, add_supCatigory_controller_post, edit_supCatigory_controller_get, edit_supCatigory_controller_post, delete_supcatigory_controller, active_supcatigory_controller } = require("../../Controller/backEnd/supCatigory_controller");
const { uploade_img_multi_fild } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const { userAuthonticat } = require("../../middel_ware/frontEnd/userAuthonticate");
const { catigoryValidation } = require("../../validations/backEnd/catigorys.validation");


router.get("/" , isAuthonticate , show_supCatigory_controller);

router.get("/addSupCatigory" , isAuthonticate , add_supCatigory_controller_get);
router.post("/getMainCatigoryAjax/:id/:id2" , get_main_catigory_ajax);


router.post("/addSupCatigory" , isAuthonticate , uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "slug",
    }
] , "public/admin/asset/images/subCatigory_photo") , catigoryValidation() , add_supCatigory_controller_post);


router.get("/edit_supCatigory/:id" , isAuthonticate , edit_supCatigory_controller_get);
router.post("/edit_supCatigory/:id" , isAuthonticate , uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "slug",
    }
] , "public/admin/asset/images/subCatigory_photo") , catigoryValidation() , edit_supCatigory_controller_post);


router.post("/delete_supcatigory/:id" , isAuthonticate , delete_supcatigory_controller);
router.get("/active_supcatigory/:id" , isAuthonticate , active_supcatigory_controller);








module.exports = {
    supCatigorysRouter : router
}