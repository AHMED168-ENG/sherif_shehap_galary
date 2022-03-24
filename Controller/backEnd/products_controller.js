const { validationResult } = require("express-validator")
const { Op } = require("sequelize")
const { tryError, handel_validation_errors, removeImgFiled, Rename_uploade_img_multiFild, returnWithMessage, get_another_language, removeImg, setAllRowWithLanguage, defaultLanguage } = require("../../Helper/helper")
const db = require("../../models")



/*-------------------------------- start show all --------------------------------*/
const show_products_controller = async (req , res , next) => {
    try {
        var allProducts = await db.products.findAll({include : [{model : db.catigorys , as : "productCate" , attributes : ["name_" + defaultLanguage()]}]})
        res.render("backEnd/products/showProduct_view" , {
            title : "All Products",
            notification : req.flash("notification")[0],
            allProducts : allProducts,
            adminData : req.cookies.Admin,
            defaultLanguage : defaultLanguage(),
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end show all --------------------------------*/

/*-------------------------------- start add products --------------------------------*/
const add_product_controller_get = async (req , res , next) => {
    try {
        var activeLanuage = await db.language.scope("allLanguageActive").findAll()
        var catigorys = await db.catigorys.scope("allCatigory").findAll()
        res.render("backEnd/products/addProduct_view" , {
            title : "Add Sup Catigory",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            activeLanuage : activeLanuage,
            catigorys : catigorys,
            defaultLanguage : defaultLanguage(),
            old1 : req.flash("old1"),
            old2 : req.flash("old2")
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add products --------------------------------*/

/*-------------------------------- start add products --------------------------------*/
const add_product_controller_post = async (req , res , next) => {
    try {
        var url = ""
        var user = ""
        if(req.url == "/vendoer_add_product") {
            url = "vendoer_add_product"
            user = req.cookies.Vendoer.userId
        } else {
            url = "addProduct"
            user = req.cookies.Admin.id
        }
        const errors = validationResult(req).errors
        if(errors.length > 0) {
            req.flash("old1" , req.body.products)
            req.flash("old2" , req.body)
            handel_validation_errors(req , res , errors , url)
            console.log(errors)
            removeImgFiled([req.files.productImage , req.files.descriptionImage , req.files.productVideo])
            return
        }
        var products = req.body.products;
        var cat = req.body.mainCatigory;
        var catigoty = cat.length == 1 ? cat[0] : (cat[cat.length - 1] ? cat[cat.length - 1] : cat[cat.length - 2])
        var files = Rename_uploade_img_multiFild([req.files.productImage , req.files.descriptionImage , req.files.productVideo])
        var rowData = await setAllRowWithLanguage(products , "products" , ["productName" , "typeOfWood" , "ProductOverview" , "fullDescription" , "pieceName" , "colors"])
        rowData.productImage = files.productImage
        rowData.descriptionImage = files.descriptionImage ? files.descriptionImage : null
        rowData.productVideo = files.productVideo ? files.productVideo : null
        rowData.keyWord = req.body.keyWord
        rowData.price = req.body.price
        rowData.userId = user
        rowData.structure = req.body.structure != "0" ? req.body.structure : null 
        rowData.shipping = req.body.shipping == "0" || req.body.price > 10000  ? null : req.body.shipping 
        rowData.security = req.body.security != "0" ? req.body.security : null 
        rowData.pay = req.body.pay 
        rowData.pieces = req.body.pieces
        rowData.available = req.body.available
        rowData.dayeOfWork = req.body.available == "0" ? req.body.dayeOfWork : null
        rowData.descount = req.body.descount != "0" ? req.body.descount : null 
        rowData.version = req.body.version
        rowData.active = req.body.active ? true : false
        rowData.comments = req.body.comments ? true : false
        rowData.likes = req.body.likes ? true : false
        rowData.interAction = req.body.interAction ? true : false
        rowData.catigory = catigoty
        rowData.productState = req.body.productState
        rowData.dayesOfUsed = req.body.productState == "0" ? req.body.dayesOfUsed : null
        await db.products.create(rowData)
        returnWithMessage(req , res , url, "تم اضافه المنتج بنجاح" , "success")




    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add products --------------------------------*/
/*-------------------------------- start add products --------------------------------*/
const edit_products_controller_get = async (req , res , next) => {
    try {
        var product = await db.products.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        var products_defaultLanguage = await db.language.scope("defaultLanguage").findOne();
        var products_fullLanguage = await db.language.scope("getLanguageWithoutDefault").findAll();
        var catigorys = await db.catigorys.scope("allCatigory").findAll()
        res.render("backEnd/products/editProducts_view" , {
            title : "edit products",
            product : product,
            products_defaultLanguage : products_defaultLanguage,
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            products_fullLanguage : products_fullLanguage,
            catigorys : catigorys
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add products --------------------------------*/

/*-------------------------------- start add products --------------------------------*/
const edit_products_controller_post = async (req , res , next) => {
    try {
        var url = ""
        if(req.url == "/vendoer_edit_product/" + req.params.id) {
            url = "/vendor/vendoer_edit_product/" + req.params.id
        } else {
            url = "/admin/products/edit_products/" + req.params.id
        }
        var productData = req.body.products
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            handel_validation_errors(req, res , errors , url)
            removeImgFiled([req.files.descriptionImage , req.files.productImage , req.files.productVideo])
            return 
        }
        var files = Rename_uploade_img_multiFild([req.files.descriptionImage , req.files.productImage , req.files.productVideo]);
        if(files.descriptionImage) {
            removeImg(req , "products_image/" , req.body.OldDescriptionImage)
        }
        if(files.productImage) {
            removeImg(req , "products_image/" , req.body.OldProductImage)
        }
        if(files.productVideo) {
            if(productData.OldProductVideo) removeImg(req , "products_image/" , productData.OldProductVideo)
        }
        var rowData = await setAllRowWithLanguage(productData , "products" , ["productName" , "typeOfWood" , "ProductOverview" , "fullDescription" , "pieceName" , "colors"])
        var mainCatigory = req.body.mainCatigory
        var catigoty = mainCatigory.length == 1 ? (!mainCatigory[0] ? productData.OldMainCatigory : mainCatigory[0]) : (!mainCatigory[mainCatigory.length - 1] ? mainCatigory[mainCatigory.length - 2] : mainCatigory[mainCatigory.length - 1])
        rowData.productVideo = files.productVideo ? files.productVideo : productData.OldProductVideo
        rowData.descriptionImage = files.descriptionImage ? files.descriptionImage : productData.OldDescriptionImage
        rowData.productImage = files.productImage ? files.productImage : productData.OldProductImage
        rowData.keyWord = req.body.keyWord
        rowData.available = req.body.available
        rowData.dayeOfWork = req.body.available == "0" ? req.body.dayeOfWork : null
        rowData.price = req.body.price
        rowData.structure = req.body.structure != "0" ? req.body.structure : null 
        rowData.shipping = req.body.shipping == "0" || req.body.price > 10000  ? null : req.body.shipping 
        rowData.security = req.body.security != "0" ? req.body.security : null 
        rowData.pay = req.body.pay 
        rowData.pieces = req.body.pieces
        rowData.descount = req.body.descount != "0" ? req.body.descount : null 
        rowData.version = req.body.version
        rowData.active = req.body.active ? true : false
        rowData.comments = req.body.comments ? true : false
        rowData.likes = req.body.likes ? true : false
        rowData.interAction = req.body.interAction ? true : false
        rowData.catigory = catigoty
        rowData.productState = req.body.productState
        rowData.dayesOfUsed = req.body.productState == "0" ? req.body.dayesOfUsed : null
        await db.products.update(rowData , {
            where: {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        returnWithMessage(req , res , url , "تم تعديل المنتج بنجاح" , "success")
        return
        
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add products --------------------------------*/


/*-------------------------------- start delete products --------------------------------*/
const delete_products_controller = async(req , res , next) => {
    try {
        await db.products.destroy({
            where : {
                id : req.params.id
            }
        })

        removeImg(req , "products_image/" , req.body.productImage)
        removeImg(req , "products_image/" , req.body.descriptionImage)
        if(req.body.slug) removeImg(req , "products_image/" , req.body.productVideo)
        returnWithMessage(req , res , "/admin/products/" , "تم حذف القسم بنجاح" , "danger")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end delete products --------------------------------*/

/*-------------------------------- start delete products --------------------------------*/
const active_products_controller = async(req , res , next) => {
    try {
        var product = await db.products.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        await db.products.update({
            active : !product.active
        } , {
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })

        var message = product.active ? "تم الغاء تفعيل القسم بنجاح" : "تم تفعيل القسم بنجاح";

        returnWithMessage(req , res , "/admin/products/" , message , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end delete products --------------------------------*/







/*-------------------------------- start get_main_catigory_ajax --------------------------------*/
const get_main_catigory_ajax = async (req , res , next) => {
    try {
        var catigorys = await db.catigorys.findAll({
            where : {
                [Op.and] : [
                    {catigoryId : {[Op.eq] : req.params.id}},
                    {id : {[Op.ne] : req.params.id2} }
                ]
            }
        })
        res.send({catigorys})
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end get_main_catigory_ajax --------------------------------*/






module.exports = {
    show_products_controller,
    add_product_controller_get,
    add_product_controller_post,
    get_main_catigory_ajax,
    edit_products_controller_get,
    edit_products_controller_post,
    delete_products_controller,
    active_products_controller
}