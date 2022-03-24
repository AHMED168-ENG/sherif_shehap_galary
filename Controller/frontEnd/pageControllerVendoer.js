const { tryError, defaultLanguage , getMainCatigory, formateDate, handel_validation_errors, removeImgFiled, Rename_uploade_img_multiFild, returnWithMessage, removeImg } = require("../../Helper/helper")
const db = require("../../models")
const paginate = require("express-paginate")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")



const vendoerHomeController = async (req , res , next) => {
    try {
        res.render("frontEnd/vendoerPages/home" , {
            title : "vendoer home",
            notification : req.flash("notification")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url
        })
    } catch (error) {
        tryError(res)
    }
}

const vendoerAllProducts = async (req , res , next) => {
    try {
        var allMyCatigory = await db.catigorys.findAll({include : [{model : db.products , as : "catigorysProduct" , attributes : ["userId"] , where : {userId : req.cookies.Vendoer.userId}}] , attributes : ["name_" + defaultLanguage() , "image" , "id" , "catigoryId"]})
        const {page , limit} = req.query;
        var newerProducts = await db.products.scope("activeProducts").findAndCountAll({
            where : {
                userId : req.cookies.Vendoer.userId
            },
            limit : limit,
            offset : limit * (parseInt(page) - 1),
            orderby : "createdAt"
        })

        res.render("frontEnd/vendoerPages/products/allProduct" , {
            title : "vendoer products",
            notification : req.flash("notification")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url,
            allMyCatigory,
            defaultLanguage : defaultLanguage(),
            newerProducts : newerProducts.rows,
            pages : paginate.getArrayPages(req)(limit , Math.ceil(newerProducts.count / limit) , page),
            pageNumber : page        
        })
    } catch (error) {
        tryError(res , error)
    }
}

const ShowAllProductPage = async (req , res , next) => {
    try {
        var {limit , page} = req.query;
        var AllProducts = await db.products.scope("activeProducts").findAndCountAll({
            where : {
                userId : req.cookies.Vendoer.userId
            },
            limit : limit,
            offset : (parseInt(page) - 1) * limit
        })
        res.render("frontEnd/vendoerPages/products/showAllProductsPage" , {
            title : "vendoer products",
            notification : req.flash("notification")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url,
            defaultLanguage : defaultLanguage(),
            AllProducts,
            pages : paginate.getArrayPages(req)(limit , Math.ceil(AllProducts.count / limit) , page),
            pageNumber : page        
        })
        } catch (error) {
        tryError(res , error)
    }
}

const vendoerOrders = async (req , res , next) => {
    try {
        res.render("frontEnd/vendoerPages/allOrders" , {
            title : "vendoer orders",
            notification : req.flash("notification")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url
        })
    } catch (error) {
        tryError(res)
    }
}

const vendoerAddProduct_controller_get = async (req , res , next) => {
    try {
        var activeLanuage = await db.language.scope("allLanguageActive").findAll()
        var catigorys = await db.catigorys.scope("allCatigory").findAll()
        res.render("frontEnd/vendoerPages/products/addProduct" , {
            title : "add product",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url,
            activeLanuage,
            catigorys,
            defaultLanguage : defaultLanguage(),
            old1 : req.flash("old1"),
            old2 : req.flash("old2")
        })
    } catch (error) {
        tryError(res , error)
    }
}

const vendoerEditProduct_controller_get = async (req , res , next) => {
    try {
        var activeLanuage = await db.language.scope("allLanguageActive").findAll()
        var catigorys = await db.catigorys.scope("allCatigory").findAll()
        var products_defaultLanguage = await db.language.scope("defaultLanguage").findOne();
        var products_fullLanguage = await db.language.scope("getLanguageWithoutDefault").findAll();
        var product = await db.products.findOne({
            where : {
                id : req.params.id,
            }
        })

        res.render("frontEnd/vendoerPages/products/editProduct" , {
            title : "edit product",
            admin : req.cookies.admin,
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url,
            activeLanuage,
            catigorys,
            defaultLanguage : defaultLanguage(),
            product,
            products_defaultLanguage,
            products_fullLanguage
        })
    } catch (error) {
        tryError(res , error)
    }
}

const allMyCatigory_controller_get = async (req , res , next) => {
    try {
        var allMyCatigory = await db.catigorys.findAll({include : [{model : db.products , as : "catigorysProduct" , attributes : ["userId"] , where : {userId : req.cookies.Vendoer.userId}}] , attributes : ["name_" + defaultLanguage() , "image" , "id" , "catigoryId"]})
        var newerProducts = await db.products.scope("activeProducts").findAll({
            where : {
                userId : req.cookies.Vendoer.userId
            },
            orderby : ["createdAt" , "asc"]
        })

        res.render("frontEnd/vendoerPages/allMyCatigorys" , {
            title : "vendoer products",
            notification : req.flash("notification")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url,
            allMyCatigory,
            defaultLanguage : defaultLanguage(),
            newerProducts
        })
    } catch (error) {
        tryError(res)
    }
}

const catigoryDetails_controller_get = async (req , res , next) => {
    try {

        var myCatigory = await db.catigorys.findOne(
            {
                include : [{model : db.products , as : "catigorysProduct" , attributes : ["userId"]  , where : {userId : req.cookies.Vendoer.userId}}],
                where : {
                    id : req.params.id
                }
            }
        )
        if(!myCatigory) {
            tryError(res , "هذا القسم غير متوفر لديك")
        }
        const {page, limit} = req.query
        var myProduct = await db.products.scope("activeProducts").findAndCountAll({
            where : {
                catigory : req.params.id
            },
            offset : (parseInt(page) - 1) * parseInt(limit),
            limit : limit,
        })
        var mainCatigory = await getMainCatigory(myCatigory.catigoryId)
        res.render("frontEnd/vendoerPages/catigoryDetails" , {
            title : "vendoer products",
            notification : req.flash("notification")[0],
            vendoer : req.cookies.Vendoer,
            url : req.url,
            myCatigory,
            defaultLanguage : defaultLanguage(),
            mainCatigory,
            formateDate : formateDate,
            myProduct : myProduct.rows,
            pages : paginate.getArrayPages(req)(limit , Math.ceil(myProduct.count / limit) , page),
            pageNumber : page
        })
    } catch (error) {
        tryError(res , error)
    }
}


const editVendoerData_get = async(req , res , next) => {
    try {
        var vendoer = await db.vendorData.findOne({
            where : {
                id : req.cookies.Vendoer.id
            }
        })
        var user = await db.users.findOne({
            where : {
                id : vendoer.userId
            },
            attributes : ["addres" , "fName" , "lName" , "email" , "age"]
        })
        res.render("frontEnd/vendoerPages/editVendoerData" , {
            title : "edit vendoer data",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            vendoer,
            url : req.url,
            user
        })
    } catch (error) {
        tryError(res)
    }
}

const editVendoerData_post = async(req , res , next) => {
    try {
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/vendor/editVendoerData_get" )
            removeImgFiled([req.files.image , req.files.commercFile])
            return
        }
        var files = Rename_uploade_img_multiFild([req.files.image , req.files.commercFile]);
        var vendoerData = req.body;
        if(files.image) {
            vendoerData.vendorImage = files.image
            removeImg(req , "users_photo/" , req.body.oldImage)
        } else {
            vendoerData.vendorImage = req.body.oldImage
        }

        if(files.commercFile) {
            vendoerData.commercFile = files.commercFile
            removeImg(req , "users_photo/" , req.body.oldCommerc)
        } else {
            vendoerData.commercFile = req.body.oldCommerc
        }
        await db.vendorData.update(vendoerData , {
            where : {
                id : req.cookies.Vendoer.id
            }
        })
        res.clearCookie("Vendoer")
        returnWithMessage(req , res , "/vendor/editVendoerData_get" , "تم تعديل البيانات بنجاح ويجب عليك التسجيل " , "success")

    } catch (error) {
        tryError(res , error)
    }
}

const editVendoerDataPassword = async(req , res , next) => {
    try {
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/vendor/editVendoerData_get")
            return
        }
        var password = bcrypt.hashSync(req.body.password , 10)
        await db.vendorData.update({
            vendoerPassword : password
        } , {
            where : {
                id : req.cookies.Vendoer.id
            }
        })
        
        res.clearCookie("Vendoer")
        returnWithMessage(req , res , "/vendor/editVendoerData_get" , "تم تغير الرقم السري بنجاح قم بالتسجيل" , "success")

    } catch (error) {
        tryError(res , error)
    }
}


module.exports = {
    vendoerHomeController,
    vendoerAllProducts,
    vendoerOrders,
    vendoerAddProduct_controller_get,
    vendoerEditProduct_controller_get,
    allMyCatigory_controller_get,
    catigoryDetails_controller_get,
    ShowAllProductPage,
    editVendoerData_get,
    editVendoerData_post,
    editVendoerDataPassword
}