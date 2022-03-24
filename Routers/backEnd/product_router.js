const router = require("express").Router();
const { show_products_controller, add_product_controller_get, add_product_controller_post, edit_products_controller_get, edit_products_controller_post, active_products_controller, delete_products_controller } = require("../../Controller/backEnd/products_controller");
const { uploade_img_multi_fild } = require("../../Helper/helper");
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const { productValidation } = require("../../validations/backEnd/productValidation");


router.get("/" , isAuthonticate , show_products_controller);
router.get("/addProduct" , isAuthonticate , add_product_controller_get);



router.post("/addProduct" , isAuthonticate , uploade_img_multi_fild([
    {
        name : "productImage",
    },
    {
        name : "descriptionImage",
    },
    {
        name : "productVideo",
    }
] , "public/admin/asset/images/products_image") , productValidation() , add_product_controller_post);

router.get("/edit_products/:id" , isAuthonticate , edit_products_controller_get);
router.post("/edit_products/:id" , isAuthonticate , uploade_img_multi_fild([
    {
        name : "productImage",
    },
    {
        name : "descriptionImage",
    },
    {
        name : "productVideo",
    }
] , "public/admin/asset/images/products_image") , productValidation() , edit_products_controller_post);



router.post("/deleteProduct/:id" , isAuthonticate , delete_products_controller);
router.get("/activeProduct/:id" , isAuthonticate , active_products_controller);






module.exports = {
    ProductsRouter : router
}