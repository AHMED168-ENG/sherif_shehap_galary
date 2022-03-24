const { add_product_controller_post, edit_products_controller_post, show_products_controller } = require("../../Controller/backEnd/products_controller")
const { vendoerHomeController, vendoerAllProducts, vendoerOrders, vendoerAddProduct_controller_get, vendoerEditProduct_controller_get, allMyCatigory_controller_get, catigoryDetails_controller_get, ShowAllProductPage, editVendoerData_get, editVendoerData_post, editVendoerDataPassword } = require("../../Controller/frontEnd/pageControllerVendoer")
const { uploade_img_multi_fild } = require("../../Helper/helper")
const { userAuthonticat } = require("../../middel_ware/frontEnd/userAuthonticate")
const { vendoerAuthonticat } = require("../../middel_ware/frontEnd/vendoer/AuthonticateVendoer")
const { productValidation } = require("../../validations/backEnd/productValidation")
const { editVendoerData_validation, editPassword_validation } = require("../../validations/frontEnd/vendoer/editVendoerData_validation")

const Router = require("express").Router()


    Router.get("/home" , userAuthonticat , vendoerAuthonticat , vendoerHomeController)
    Router.get("/allProducts" , userAuthonticat , vendoerAuthonticat , vendoerAllProducts)
    Router.get("/AllProductsPage" , userAuthonticat , vendoerAuthonticat , ShowAllProductPage)
    Router.get("/allOrders" , userAuthonticat , vendoerAuthonticat , vendoerOrders)
    Router.get("/vendoer_add_product" , userAuthonticat , vendoerAuthonticat , vendoerAddProduct_controller_get)
    Router.post("/vendoer_add_product" , userAuthonticat , vendoerAuthonticat , uploade_img_multi_fild([
        {
            name : "productImage",
        },
        {
            name : "descriptionImage",
        },
        {
            name : "productVideo",
        }
    ] , "public/admin/asset/images/products_image") , productValidation() , add_product_controller_post)
    
    Router.get("/vendoer_edit_product/:id" , userAuthonticat , vendoerAuthonticat , vendoerEditProduct_controller_get)
    Router.post("/vendoer_edit_product/:id" , userAuthonticat , vendoerAuthonticat , uploade_img_multi_fild([
        {
            name : "productImage",
        },
        {
            name : "descriptionImage",
        },
        {
            name : "productVideo",
        }
    ] , "public/admin/asset/images/products_image") , productValidation() , edit_products_controller_post)
    
    Router.get("/allMyCatigory" , userAuthonticat , vendoerAuthonticat , allMyCatigory_controller_get)
    Router.get("/catigoryDetails/:id" , userAuthonticat , vendoerAuthonticat , catigoryDetails_controller_get)
    Router.get("/editVendoerData_get" , userAuthonticat , vendoerAuthonticat , editVendoerData_get)
    Router.post("/editVendoerData_get" , userAuthonticat , vendoerAuthonticat , uploade_img_multi_fild([
        {
            name : "image",
        },
        {
            name : "commercFile",
        },
    ] , "public/admin/asset/images/users_photo") , editVendoerData_validation() , editVendoerData_post)
    Router.post("/editVendoerDataPassword" , userAuthonticat , vendoerAuthonticat , editPassword_validation() , editVendoerDataPassword)




Router.get("/test" , (req , res , nest) => {
    console.log(req.cookies.Vendoer)
})


module.exports = {
    pagesRouterVendoer : Router
}