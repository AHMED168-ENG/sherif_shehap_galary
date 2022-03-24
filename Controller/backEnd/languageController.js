const { validationResult } = require("express-validator");
const { tryError, handel_validation_errors,Rename_uploade_img, returnWithMessage, removeImg, final_uploadeImg, checkDeletedlanguage } = require("../../Helper/helper");
const db = require("../../models");




/*----------------------- start show language -------------------------*/
const showLanguage_controller = async (req , res , next) => {
    try {
        var allLanguage = await db.language.findAll();
        res.render("backEnd/language/showLanguage_view" , {
            title : "All Language",
            notification : req.flash("notification")[0],
            allLanguage : allLanguage,
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add language -------------------------*/

/*----------------------- start add language -------------------------*/
const addLanguage_controller_get = async (req , res , next) => {
    try {
        res.render("backEnd/language/addLanguage_view" , {
            title : "Add Language",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add language -------------------------*/

/*----------------------- start add language post -------------------------*/
const addLanguage_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            await handel_validation_errors(req , res , errors , "addLanguage" );
            removeImg(req)
            return
        }
        var image = Rename_uploade_img(req)
        db.language.create({
            language : req.body.language,
            direction : req.body.direction,
            active : req.body.active ? true : false,
            shourtcut : req.body.shourtcut,
            country_img : image
        })
        returnWithMessage(req , res , "addLanguage" , "تم اضافت لغه جديده بنجاح" , "success")
    } catch (error) {
        tryError(res, error)
    }
}
/*----------------------- end add language post -------------------------*/


/*----------------------- start edit language -------------------------*/
const editLanguage_controller_get = async (req , res , next) => {
    try {
        var language_data = await db.language.findByPk(req.params.id)
        res.render("backEnd/language/editLanguage_view" , {
            title : "Edit Language",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            language_data : language_data,
            adminData : req.cookies.Admin
        })    
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit language -------------------------*/

/*----------------------- start edit language post -------------------------*/
const editLanguage_controller_post = async (req , res , next) => {
    try {
        var validation_errors = validationResult(req);
        if(validation_errors.errors.length > 0) {
            handel_validation_errors(req , res , validation_errors.errors , req.originalUrl)
            removeImg(req)
            return 
        }
        var image = Rename_uploade_img(req)
        if(image) {
            removeImg(req , "/languages/" , req.body.oldImage)
        } else {
            image = req.body.oldImage
        }
        await db.language.update({
            language : req.body.language,
            direction : req.body.direction,
            active : req.body.active ? true : false,
            shourtcut : req.body.shourtcut,
            country_img : image
        } , {
            where : {
                id : req.params.id
            }
        })
        returnWithMessage(req , res , req.originalUrl , "تم تعديل اللغه بنجاح", "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit language post -------------------------*/

/*----------------------- start delete Language -------------------------*/
const deleteLanguage_controller = async (req, res , next) => {
    try {
        var dataLanguage = req.body;
        await db.language.destroy({
            where : {
                id : req.params.id
            }
        })
        removeImg(req , "languages/" , dataLanguage.image)
        returnWithMessage(req , res , "/admin/language/" , "تم حذف اللغه بنجاح" , "danger")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete Language -------------------------*/








module.exports = {
    showLanguage_controller,
    addLanguage_controller_get,
    addLanguage_controller_post,
    editLanguage_controller_get,
    editLanguage_controller_post,
    deleteLanguage_controller
}