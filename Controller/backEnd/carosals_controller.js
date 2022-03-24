const { validationResult } = require("express-validator");
const { tryError, handel_validation_errors, uploade_img, getMainCatigory , Rename_uploade_img, returnWithMessage, removeImg , removeImgFiled, Rename_uploade_img_multiFild, defaultLanguage, get_another_language, setAllRowWithLanguage } = require("../../Helper/helper");
const { Op } = require("sequelize");
const db = require("../../models");


var allCarosalsLocations = ["HOME_TOP" , "ACCESSORIE"]
/*----------------------- start show catigorys -------------------------*/
const showCarosal_controller = async (req , res , next) => {
    try {
        var allCarosals = await db.carosals.findAll({
            include : [{model : db.catigorys , as : "mainCatigory" , attributes : [`name_${defaultLanguage()}`]}]
        });

        res.render("backEnd/carosals/showCarosal_view" , {
            title : "All Carosals",
            notification : req.flash("notification")[0],
            allCarosals : allCarosals,
            adminData : req.cookies.Admin,
            defaultLanguage : defaultLanguage(),
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end add catigorys -------------------------*/

/*----------------------- start add catigorys -------------------------*/
const addCarosal_controller = async (req , res , next) => {
    try {

        var ActiveLanguage = await db.language.scope("allLanguageActive").findAll()
        var catigorys = await db.catigorys.scope("allCatigory" , "active").findAll()

        res.render("backEnd/carosals/addCarosal_view" , {
            title : "Add carosals",                       
            notification : req.flash("notification")[0], 
            validationError : req.flash("validationError")[0],
            adminData : req.cookies.Admin,
            allCarosalsLocations,
            activeLanguage : ActiveLanguage,
            catigorys,
            defaultLanguage : defaultLanguage()
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end add catigorys -------------------------*/

/*----------------------- start add catigorys post -------------------------*/
const addCarosal_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "addCarosal");
            removeImg(req , "carosals_photo")
            return
        }
        var image = Rename_uploade_img(req)
        var carosal = req.body.carosal;
        var rowData = await setAllRowWithLanguage(carosal , "carosals" , ["header" , "description"])
        var lastElementInCatigory = req.body.catigory[req.body.catigory.length - 1]
        var beforeLastElementInCatigory = req.body.catigory[req.body.catigory.length - 2]
        rowData.locationInProject = req.body.location
        rowData.images = image
        rowData.catigory = req.body.catigory.length == 1 ? req.body.catigory[0] : (lastElementInCatigory ? lastElementInCatigory : beforeLastElementInCatigory)
        rowData.active = req.body.active ? true : false
        await db.carosals.create(rowData)
        returnWithMessage(req , res , "/admin/Carosals/" , "تم اضافه كاروسال جديد للموقع", "success") 

    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add catigorys post -------------------------*/


/*----------------------- start edit catigorys -------------------------*/
const editCarosal_controller_get = async (req , res , next) => {
    try {
        var carosalData = await db.carosals.findOne({
            where : {
                id : req.params.id
            }
        })
        var catigorys = await db.catigorys.scope("allCatigory" , "active").findAll()
        var defaultLanguageCarosal = await db.language.scope("allLanguageActive" , "defaultLanguage").findOne()
        var fullLanguage = await db.language.scope("allLanguageActive" , "getLanguageWithoutDefault").findAll()


        res.render("backEnd/carosals/editCarosal_view" , {
            title : "Edit carosal",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            carosalData : carosalData,
            adminData : req.cookies.Admin,
            defaultLanguage : defaultLanguage(),
            fullLanguage : fullLanguage,
            allCarosalsLocations : allCarosalsLocations, 
            catigorys,
            defaultLanguageCarosal
        })    
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end edit catigorys -------------------------*/

/*----------------------- start edit catigorys post -------------------------*/
const editCarosal_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/admin/Carosals/editCarosal/" + req.params.id );
            removeImg(req , "carosals_photo")
            return
        }
        var CarosalImages = Rename_uploade_img(req)
        if(CarosalImages) removeImg(req , "carosals_photo/" , req.body.oldImage)

        var carosals = req.body.carosal;
        
        var rowData = await setAllRowWithLanguage(carosals , "carosals" , ["header" , "description"])
        console.log(rowData)
        var lastElementInCatigory = req.body.catigory[req.body.catigory.length - 1]
        var beforeLastElementInCatigory = req.body.catigory[req.body.catigory.length - 2]
        rowData.images = CarosalImages ? CarosalImages : req.body.oldImage
        rowData.active = req.body.active ? true : false
        rowData.catigory = req.body.catigory[0] ? (req.body.catigory.length == 1 ? req.body.catigory[0] : (lastElementInCatigory ? lastElementInCatigory : beforeLastElementInCatigory)) : req.body.oldCatigory
        rowData.locationInProject = req.body.location
        
        await db.carosals.update(rowData , {
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        returnWithMessage(req , res , "/admin/Carosals/editCarosal/" + req.params.id , "تم تعديل القسم بنجاح", "success") 
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys post -------------------------*/

/*----------------------- start active catigorys -------------------------*/
const active_Carosals_controller = async (req, res , next) => {
    try {
        await db.carosals.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            } 
        }).then(async(resalt) => {
            await db.carosals.update({
                active : resalt.active ? false : true
            } , {
                where : {
                    id : req.params.id
                }
        })
            var message  = resalt.active ? "تم الغاء التفعيل بنجاح" : "تم النفعيل بنجاح"
            returnWithMessage(req , res , "/admin/Carosals/" , message , "success")
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end active catigorys -------------------------*/








module.exports = {
    showCarosal_controller,
    addCarosal_controller,
    addCarosal_controller_post,
    editCarosal_controller_get,
    editCarosal_controller_post,
    active_Carosals_controller
}