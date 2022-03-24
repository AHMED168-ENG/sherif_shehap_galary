const { validationResult } = require("express-validator");
const { tryError, handel_validation_errors, uploade_img, Rename_uploade_img, returnWithMessage, removeImg , removeImgFiled, Rename_uploade_img_multiFild, defaultLanguage, get_another_language, setAllRowWithLanguage } = require("../../Helper/helper");
const { Op } = require("sequelize");
const db = require("../../models");




/*----------------------- start show catigorys -------------------------*/
const showCatigorys_controller = async (req , res , next) => {
    try {
        var allcatigorys = await db.catigorys.scope("allCatigory").findAll();
        res.render("backEnd/catigorys/showCatigory_view" , {
            title : "All catigorys",
            notification : req.flash("notification")[0],
            allcatigorys : allcatigorys,
            adminData : req.cookies.Admin,
            defaultLanguage : defaultLanguage()
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add catigorys -------------------------*/

/*----------------------- start add catigorys -------------------------*/
const addCatigorys_controller_get = async (req , res , next) => {
    try {
        var ActiveLanguage = await db.language.scope("allLanguageActive").findAll()
        res.render("backEnd/catigorys/addCatigory_view" , {
            title : "Add catigorys",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            adminData : req.cookies.Admin,
            activeLanguage : ActiveLanguage
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add catigorys -------------------------*/

/*----------------------- start add catigorys post -------------------------*/
const addCatigorys_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "addcatigory");
            removeImgFiled([req.files.image , req.files.slug])
            return
        }
        var fields_img = Rename_uploade_img_multiFild([req.files.image , req.files.slug])
        var catigory = req.body.catigors;
        var rowData = await setAllRowWithLanguage(catigory , "catigorys" , ["name" , "description"])
        rowData.image = fields_img.image
        rowData.slug = fields_img.slug ? fields_img.slug : ""
        rowData.active = req.body.active ? true : false
        rowData.interAction = req.body.interAction ? true : false
        rowData.catigoryId = 0
        await db.catigorys.create(rowData)
        returnWithMessage(req , res , "addcatigory" , "تم اضافه قسم رءيسي جديد", "success") 

    } catch (error) {
        tryError(res, error)
    }
}
/*----------------------- end add catigorys post -------------------------*/


/*----------------------- start edit catigorys -------------------------*/
const editCatigorys_controller_get = async (req , res , next) => {
    try {
        var catigorys_data = await db.catigorys.findByPk(req.params.id)
        var defaultLanguage = await db.language.scope("allLanguageActive" , "defaultLanguage").findOne()
        var fullLanguage = await db.language.scope("allLanguageActive" , "getLanguageWithoutDefault").findAll()

        res.render("backEnd/catigorys/editcatigory_view" , {
            title : "Edit catigorys",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            catigorys_data : catigorys_data,
            adminData : req.cookies.Admin,
            defaultLanguage : defaultLanguage,
            fullLanguage : fullLanguage
        })    
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys -------------------------*/

/*----------------------- start edit catigorys post -------------------------*/
const editCatigorys_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/admin/catigors/editCatigory/" + req.params.id );
            removeImgFiled([req.files.image , req.files.slug])
            return
        }
        var fields_img = Rename_uploade_img_multiFild([req.files.image , req.files.slug])
        if(fields_img.image) removeImg(req , "categoris_photo/" , req.body.oldImage)
        if(fields_img.slug && req.body.oldSlug) removeImg(req , "categoris_photo/" , req.body.oldSlug)
        
        var catigory = req.body.catigors;
        var rowData = await setAllRowWithLanguage(catigory , "catigorys" , ["name" , "description"])
        rowData.image = fields_img.image ? fields_img.image : req.body.oldImage
        rowData.slug = fields_img.slug ? fields_img.slug : req.body.oldSlug
        rowData.active = req.body.active ? true : false
        rowData.interAction = req.body.interAction ? true : false
        rowData.catigoryId = 0
        await db.catigorys.update(rowData , {
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        returnWithMessage(req , res , "/admin/catigors/editCatigory/" + req.params.id , "تم تعديل القسم بنجاح", "success") 
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys post -------------------------*/

/*----------------------- start delete catigorys -------------------------*/
const deleteCatigorys_controller = async (req, res , next) => {
    try {
        await db.catigorys.destroy({
            where : {
                id : req.params.id
            }
        })
        removeImg(req , "categoris_photo/" , req.body.image)
        if(req.body.slug) removeImg(req , "categoris_photo/" , req.body.slug)
        returnWithMessage(req , res , "/admin/catigors/" , "تم حذف القسم بنجاح" , "danger")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete catigorys -------------------------*/

/*----------------------- start active catigorys -------------------------*/
const active_Catigorys_controller = async (req, res , next) => {
    try {
        await db.catigorys.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            } 
        }).then(async(resalt) => {
            await db.catigorys.update({
                active : resalt.active ? false : true
            } , {
                where : {
                    id : req.params.id
                }
        })
            var message  = resalt.active ? "تم الغاء التفعيل بنجاح" : "تم النفعيل بنجاح"
            returnWithMessage(req , res , "/admin/catigors/" , message , "success")
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end active catigorys -------------------------*/








module.exports = {
    showCatigorys_controller,
    addCatigorys_controller_get,
    addCatigorys_controller_post,
    editCatigorys_controller_get,
    editCatigorys_controller_post,
    deleteCatigorys_controller,
    active_Catigorys_controller
}