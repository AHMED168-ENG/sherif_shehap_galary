const { showProductComments_Controller , addProductComments_Controller_get, addProductComments_Controller_post, deleteComment, editCommentsProduct_get, editCommentsProduct_post, addProductAjax, addProductCommentAjax, addProductInterActionAjax, addRateProduct} = require("../../Controller/backEnd/productsComments_controller")
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate")
const { productCommentsValidation } = require("../../validations/backEnd/productComments_validation")

const Router = require("express").Router()




Router.get("/show/:id" , isAuthonticate , showProductComments_Controller)
Router.get("/addProductComment" , isAuthonticate , addProductComments_Controller_get)
Router.post("/addProductComment" , isAuthonticate , productCommentsValidation() , addProductComments_Controller_post)
Router.post("/addProductCommentAjax" , addProductCommentAjax)
Router.post("/addProductInterActionAjax" , addProductInterActionAjax)
Router.post("/addRateProduct" , addRateProduct)
Router.get("/editCommentProduct/:id" , isAuthonticate , editCommentsProduct_get)
Router.post("/editCommentProduct/:id" , isAuthonticate , productCommentsValidation() , editCommentsProduct_post)
Router.post("/deleteComment/:id" , isAuthonticate , deleteComment)







module.exports = {
    productCommentsRouter : Router
}