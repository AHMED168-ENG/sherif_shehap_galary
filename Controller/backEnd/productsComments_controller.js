const { validationResult } = require("express-validator")
const { tryError, defaultLanguage, handel_validation_errors, returnWithMessage, formateDate, gerSumOfArray } = require("../../Helper/helper")
const sequelize = require("sequelize")
const db = require("../../models")





/*-------------------- start show all products comments ----------------------------------*/
const showProductComments_Controller = async (req , res , next) => {
    try {
        var productComments = await db.productComments.scope("active").findAll({include : [{model : db.users , as : "CommentUser" , attributes : ["fName" , "lName" , "id" , "image"]}] , where : {
            productId : req.params.id
        } , attributes : ["comment" , "likes" , "desLikes" , "createdAt" , "productId" , "id"]})
        var productName = await db.products.findOne({where : {
            id : req.params.id
        } , attributes : ["productName" + "_" + defaultLanguage()]})
        res.render("backEnd/productsComments/showProductAllComments_view" , {
            title : "all product comments",
            notification : req.flash("notification")[0],
            productComments : productComments,
            adminData : req.cookies.Admin,
            productName : productName["productName" + "_" + defaultLanguage()],
            formateDate : formateDate
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end show all products comments ----------------------------------*/

/*-------------------- start addProductComments ----------------------------------*/
const addProductComments_Controller_get = async (req , res , next) => {
    try {
        var products = await db.products.scope("activeProducts").findAll()
        res.render("backEnd/productsComments/addProductComments_view" , {
            title : "Add Product Comment",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            products : products,
            defaultLang : defaultLanguage(),
            validationError : req.flash("validationError")[0],
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end addProductComments ----------------------------------*/

/*-------------------- start addProductComments_Controller post ----------------------------------*/
const addProductComments_Controller_post = async (req , res , next) => {
    try {
        var productComments = req.body
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            console.log(errors)
            handel_validation_errors(req , res , errors , "addProductComment")
            return
        }
        productComments.likes = parseInt(productComments.likes)
        productComments.desLikes = parseInt(productComments.desLikes)
        productComments.userId = req.cookies.Admin.id
        await db.productComments.create(productComments)
        returnWithMessage(req , res , "addProductComment" , "تم اضافه الكومنت بنجاح", "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end addProductComments_Controller post ----------------------------------*/

/*-------------------- start editCommentsProduct get ----------------------------------*/
const editCommentsProduct_get = async (req , res , next) => {
    try {
        var comment = await db.productComments.findOne({
            where : {
                id : req.params.id
            }
        })
        var products = await db.products.scope("activeProducts").findAll()
        res.render("backEnd/productsComments/editComments_view" , {
            title : "Edit Product Comment",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            comment : comment,
            products : products,
            defaultLang : defaultLanguage(),
            validationError : req.flash("validationError")[0],
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end editCommentsProduct get ----------------------------------*/

/*-------------------- start editCommentsProduct post ----------------------------------*/
const editCommentsProduct_post = async (req , res , next) => {
    try {
        var comment = req.body
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req,res , errors , "/admin/productComments/editCommentProduct/" + req.params.id)
            return
        }
        comment.active = comment.active ? true : false
        await db.productComments.update(comment , {
            where : {
                id : req.params.id
            }
        })
        returnWithMessage(req, res , "/admin/productComments/editCommentProduct/" + req.params.id , "تم تعديل الكومنت بنجاح" , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end editCommentsProduct post ----------------------------------*/


/*-------------------- start delete Comment post ----------------------------------*/
const deleteComment = async (req , res , next) => {
    try {
        await db.productComments.destroy({
            where : {
                id : req.params.id
            }
        })
        returnWithMessage(req , res , "/admin/productComments/show/" + req.body.productId , "تم حذف الكومنت بنجاح", "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end delete Comment post ----------------------------------*/




/*-------------------- add comment ajax ----------------------------------*/
const addProductCommentAjax = async (req , res , next) => {
    try {
        await db.productComments.create({
            comment : req.body.comment,
            likes : 0,
            desLikes : 0,
            userId : req.body.id,
            active : true,
            productId : req.body.productId,
            likesUser : [],
            desLikesUser : [],
        }).then((resualt) => {
            res.send({id : resualt.id})
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- add comment ajax ----------------------------------*/
/*-------------------- add comment ajax ----------------------------------*/
const addProductInterActionAjax = async (req , res , next) => {
    try {

        var comment = await db.productComments.findOne({
            where : {
                id : req.body.commentId
            }
        })
        if(req.body.likes > comment.likes) {
            if(comment.desLikesUser.includes(parseInt(req.body.userId))) {
                comment.desLikesUser.splice(comment.desLikesUser.indexOf(parseInt(req.body.userId)) , 1)
            } 
            comment.likesUser.push(parseInt(req.body.userId))

        } else {
            if(comment.likesUser.includes(parseInt(parseInt(req.body.userId)))) {
                comment.likesUser.splice(comment.likesUser.indexOf(parseInt(req.body.userId)) , 1)
            }
            if(req.body.desLikes > comment.desLikes) {
                comment.desLikesUser.push(parseInt(req.body.userId))
            } else {
                comment.desLikesUser.splice(comment.desLikesUser.indexOf(parseInt(req.body.userId)) , 1)
            }
        }

        await db.productComments.update({
            likes : req.body.likes,
            desLikes : req.body.desLikes,
            likesUser : comment.likesUser,
            desLikesUser : comment.desLikesUser,
        } , {
            where : {
                id : req.body.commentId
            }
        })
        res.send("تم التعديل بنجاح")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- add comment ajax ----------------------------------*/

/*-------------------- add rate ajax ----------------------------------*/
const addRateProduct = async (req , res , next) => {
    try {
        var productRate = await db.productRating.findOne({
            where : {
                productId : req.body.productId,
            }
        })
        if(!productRate) {
            await db.productRating.create({
                usersId : [req.body.userId],
                productId : req.body.productId,
                ratings : [req.body.rate],
                sumRate : (((1 * 100 ) / (1 * 5)) / 20).toFixed(1)
            })
            await db.products.update({
                sumRate : (((1 * 100 ) / (1 * 5)) / 20).toFixed(1)
            }, {where : {
                productId : req.body.productId,
            }})
        } else {
            if(productRate.usersId.includes(parseInt(req.body.userId))) {
                productRate.ratings[productRate.usersId.indexOf(parseInt(req.body.userId))] = req.body.rate
                await db.productRating.update({
                    ratings : productRate.ratings,
                    sumRate : Math.ceil(((gerSumOfArray(productRate.ratings) * 100 ) / (productRate.ratings.length * 5)) / 20)
                } , {
                    where : {
                        productId : req.body.productId,
                    }
                })    
        
            } else {

                productRate.ratings.push(req.body.rate)
                productRate.usersId.push(req.body.userId)
                await db.productRating.update({
                    ratings : productRate.ratings,
                    usersId : productRate.usersId,                
                    sumRate : Math.ceil(((gerSumOfArray(productRate.ratings) * 100 ) / (productRate.ratings.length * 5)) / 20)
                } , {
                    where : {
                        productId : req.body.productId,
                    }
                })               
            }
            await db.products.update({
                sumRate : Math.ceil(((gerSumOfArray(productRate.ratings) * 100 ) / (productRate.ratings.length * 5)) / 20)
            }, {where : {
                id : req.body.productId,
            }})
        }
        res.send("")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- add rate ajax ----------------------------------*/



module.exports = {
    showProductComments_Controller,
    addProductComments_Controller_get,
    addProductComments_Controller_post,
    deleteComment,
    editCommentsProduct_get,
    editCommentsProduct_post,
    addProductCommentAjax,
    addProductInterActionAjax,
    addRateProduct
}