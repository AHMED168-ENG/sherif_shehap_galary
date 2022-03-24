const { addUserSearch_post } = require("../../Controller/backEnd/userSearchController")
const { MainPageController, catigoryShow_controller , payForWebsit , shopingCardChangQuantity , removeProductFromShipingCard , shopingCart_controller , addProductToShopingCart , addIsSeenFromChate , removeIsSeenFromChate , getUserNotification , UserMessage , getFrindMessages , sendMessage , changeCoverImage , acceptFrindRequest , CancelRequest , getAllRequest , addRequest , getCommentData , editCommentAjax , deleteCommentAjax , editPostAjax , getPost_Data , deletePost_ajax , membersPosts , getEmoji , GetSomeOfPosts , AddLikesOnCommentsAjax , getMoreComments , addCommentOnPosts , productDetails_controller, getProductAllComments, getAllProduct, getDataSearch_ajax, getMyAccount, editPersonalInformationGet, getSearchUserData, addPostAjax, AddLikesAjax, editPost, editPersonalInformationPost} = require("../../Controller/frontEnd/pagesControllerUser")
const { uploade_img, uploade_img_multi_fild } = require("../../Helper/helper")
const { userAuthonticat } = require("../../middel_ware/frontEnd/userAuthonticate")
const { editPersonalData_validation } = require("../../validations/frontEnd/editPersonalData_validation")

const Router = require("express").Router()




    Router.get("/home" , MainPageController)
    Router.get("/catigoryDetails/:id" , catigoryShow_controller )
    Router.get("/productDetails/:id" , productDetails_controller)
    Router.get("/ProductAllComments/:id" , getProductAllComments)
    Router.post("/AddProductSearch/:id" , addUserSearch_post)
    Router.post("/getSearchData" , getDataSearch_ajax)
    Router.post("/getSearchUserData" , getSearchUserData)
    Router.get("/AllProduct" , getAllProduct)
    Router.get("/userProfile/:id" , userAuthonticat , getMyAccount)
    Router.get("/news" , userAuthonticat , getMyAccount)
    Router.get("/editPersonalInformation" , userAuthonticat , editPersonalInformationGet)
    Router.post("/editPersonalInformation" , userAuthonticat , uploade_img("public/admin/asset/images/users_photo" , "image") , editPersonalData_validation() , editPersonalInformationPost)
    Router.get("/membersPosts" , userAuthonticat , membersPosts)

    /*-------------------------------------------- start part of posts ----------------------------------------*/
    Router.post("/addPostAjax" , userAuthonticat , uploade_img_multi_fild([
        {
            name : "image",
        },
        {
            name : "video",
        },
    ] , "public/admin/asset/images/posts") , addPostAjax) 
    /*-------------------------------------------- edit post ajax ----------------------------------------*/
    Router.post("/editPostAjax" , userAuthonticat , uploade_img_multi_fild([
        {
            name : "image",
        },
        {
            name : "video",
        },
    ] , "public/admin/asset/images/posts") , editPostAjax) 
    Router.post("/AddLikes" , userAuthonticat , AddLikesAjax)
    Router.post("/addCommentOnPosts" , userAuthonticat , uploade_img(
        "public/admin/asset/images/commentsPhoto",
        "image"
    ) , addCommentOnPosts)
    Router.post("/deleteCommentAjax" , userAuthonticat , deleteCommentAjax)
    Router.post("/editCommentAjax" , userAuthonticat , uploade_img(
        "public/admin/asset/images/commentsPhoto",
        "image"
    ) , editCommentAjax)
    Router.post("/getCommentData" , userAuthonticat , getCommentData)
    Router.post("/getMoreComments" , userAuthonticat , getMoreComments)
    Router.post("/AddLikesOnCommentsAjax" , userAuthonticat , AddLikesOnCommentsAjax)
    Router.post("/GetSomeOfPosts" , userAuthonticat , GetSomeOfPosts)
    Router.post("/getEmoji" , userAuthonticat , getEmoji)
    Router.post("/deletePost_ajax" , userAuthonticat , deletePost_ajax)
    Router.post("/getPost_Data" , userAuthonticat , getPost_Data)
    Router.post("/addRequest" , userAuthonticat , addRequest)
    Router.post("/CancelRequest" , userAuthonticat , CancelRequest)
    Router.post("/acceptFrindRequest" , userAuthonticat , acceptFrindRequest)
    Router.post("/getAllRequest" , userAuthonticat , getAllRequest)
    Router.post("/getUserNotification" , userAuthonticat , getUserNotification)
    Router.post("/changeCoverImage" , userAuthonticat , uploade_img(
        "public/admin/asset/images/users_photo/cover_image",
        "imageCover"
        ) , changeCoverImage)
    Router.post("/getFrindMessages" , userAuthonticat , getFrindMessages)
    Router.post("/UserMessage" , userAuthonticat , UserMessage)
    Router.post("/sendMessage" , userAuthonticat , sendMessage)
    Router.post("/removeIsSeenFromChate" , userAuthonticat , removeIsSeenFromChate)
    Router.post("/addIsSeenFromChate" , userAuthonticat , addIsSeenFromChate)
    Router.post("/addProductToShopingCart" , userAuthonticat , addProductToShopingCart)
    Router.get("/shopingCard/:id" , userAuthonticat , shopingCart_controller)
    Router.post("/shopingCardChangQuantity" , userAuthonticat , shopingCardChangQuantity)
    Router.post("/removeProductFromShipingCard" , userAuthonticat , removeProductFromShipingCard)
    Router.post("/payForWebsit" , userAuthonticat , payForWebsit)


    /*-------------------------------------------- end part of posts ----------------------------------------*/








module.exports = {
    pagesRouterUser : Router
}