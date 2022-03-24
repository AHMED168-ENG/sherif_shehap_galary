const { showLanguage_controller, addLanguage_controller_get, addLanguage_controller_post, editLanguage_controller_get, editLanguage_controller_post, deleteLanguage_controller } = require("../../Controller/backEnd/languageController");
const { uploade_img } = require("../../Helper/helper");
const db = require("../../models");
const { language_validation } = require("../../validations/backEnd/language_validation");
const router = require("express").Router();
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");





router.get("/" , isAuthonticate,  showLanguage_controller);


router.get("/addLanguage" , isAuthonticate , addLanguage_controller_get);


router.post("/addLanguage" , isAuthonticate , uploade_img( "public/admin/asset/images/languages" , "country_photo") , language_validation() , addLanguage_controller_post);


router.get("/editLanguage/:id" , isAuthonticate , editLanguage_controller_get);
router.post("/editLanguage/:id" , isAuthonticate , uploade_img( "public/admin/asset/images/languages" , "country_photo")  , language_validation() , editLanguage_controller_post);

router.post("/deleteLanguage/:id" , isAuthonticate , deleteLanguage_controller);





router.get("/test" , (req , res) => {
    console.log(req.cookies)
});













module.exports = {
    languageRouter : router
}