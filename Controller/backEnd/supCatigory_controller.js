const { validationResult } = require("express-validator")
const { Op } = require("sequelize")
const {getCatigory, tryError, handel_validation_errors, removeImgFiled, Rename_uploade_img_multiFild, defaultLanguage, returnWithMessage, get_another_language, removeImg, setAllRowWithLanguage } = require("../../Helper/helper")
const db = require("../../models")



/*-------------------------------- start show all --------------------------------*/
const show_supCatigory_controller = async (req , res , next) => {
    try {
        var allSupCatigory = await db.catigorys.scope("allSupCatigory").findAll()
        res.render("backEnd/supCatigorys/showSupCatigory_view" , {
            title : "All Sup Catigory",
            notification : req.flash("notification")[0],
            allSupCatigory : allSupCatigory,
            adminData : req.cookies.Admin,
            defaultLanguage : defaultLanguage(),
            getCatigory : getCatigory
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end show all --------------------------------*/

/*-------------------------------- start add supCatigory --------------------------------*/
const add_supCatigory_controller_get = async (req , res , next) => {
    try {
        var activeLanuage = await db.language.scope("allLanguageActive").findAll()
        var catigorys = await db.catigorys.scope("allCatigory").findAll()
        res.render("backEnd/supCatigorys/addSupCatigory_view" , {
            title : "Add Sup Catigory",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            activeLanuage : activeLanuage,
            catigorys : catigorys,
            defaultLanguage : defaultLanguage()
        })
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/

/*-------------------------------- start add supCatigory --------------------------------*/
const add_supCatigory_controller_post = async (req , res , next) => {
    try {
        const errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "addSupCatigory")
            removeImgFiled([req.files.image , req.files.slug])
            return
        }
        var supCatigoryData = req.body.catigors;
        var lastElementInCatigoryId = req.body.mainCatigory[req.body.mainCatigory.length - 1]
        var catigoryId = req.body.mainCatigory.length == 1 ? req.body.mainCatigory[0] : (lastElementInCatigoryId ? lastElementInCatigoryId :  req.body.mainCatigory[req.body.mainCatigory.length - 2])
        var fields_img = Rename_uploade_img_multiFild([req.files.image , req.files.slug])
        var rowData = await setAllRowWithLanguage(supCatigoryData , "catigorys" , ["name" , "description"])
        rowData.image = fields_img.image
        rowData.slug = fields_img.slug ? fields_img.slug : null
        rowData.active = req.body.active ? true : false
        rowData.interAction = req.body.interAction ? true : false
        rowData.catigoryId = catigoryId
        await db.catigorys.create(rowData)
        returnWithMessage(req , res , "addSupCatigory" , "تم اضافه قسم فرعي جديد", "success") 

    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/
/*-------------------------------- start add supCatigory --------------------------------*/
const edit_supCatigory_controller_get = async (req , res , next) => {
    try {
        var supCatigory = await db.catigorys.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        var supCatigory_defaultLanguage = await db.language.scope("defaultLanguage").findOne();
        var supCatigory_fullLangugaes = await db.language.scope("getLanguageWithoutDefault").findAll();
        var catigorys = await db.catigorys.scope("allCatigory").findAll()
        res.render("backEnd/supCatigorys/editSupCatigory_view" , {
            title : "edit supcatigory",
            supCatigory_defaultLanguage : supCatigory_defaultLanguage,
            supCatigory_fullLangugaes : supCatigory_fullLangugaes,
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            catigorys : catigorys,
            supCatigory : supCatigory,
            defaultLang : defaultLanguage()
        })
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/

/*-------------------------------- start add supCatigory --------------------------------*/
const edit_supCatigory_controller_post = async (req , res , next) => {
    try {

        const errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/admin/supCatigory/edit_supCatigory/" + req.params.id)
            removeImgFiled([req.files.image , req.files.slug])
            return
        }
        var supCatigoryData = req.body.catigors;
        var lastElementInCatigoryId = req.body.mainCatigory[req.body.mainCatigory.length - 1]
        var catigoryId = req.body.mainCatigory.length == 1 ? (req.body.mainCatigory[0] == "" ? req.body.oldMainCatigory : req.body.mainCatigory[0] ) : (lastElementInCatigoryId ? lastElementInCatigoryId :  req.body.mainCatigory[req.body.mainCatigory.length - 2])
        var fields_img = Rename_uploade_img_multiFild([req.files.image , req.files.slug])
        if(fields_img.image) {
            removeImg(req , "subCatigory_photo/" , req.body.image)
        }
        if(fields_img.slug) {
            if(req.body.slug) removeImg(req , "subCatigory_photo/" , req.body.slug)
        }
        var rowData = await setAllRowWithLanguage(supCatigoryData , "catigorys" , ["name" , "description"])
        rowData.image = fields_img.image ? fields_img.image : req.body.image
        rowData.slug = fields_img.slug ? fields_img.slug : req.body.slug
        rowData.active = req.body.active ? true : false
        rowData.interAction = req.body.interAction ? true : false
        rowData.catigoryId = catigoryId
        await db.catigorys.update(rowData , {
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        returnWithMessage(req , res , "/admin/supCatigory/edit_supCatigory/" + req.params.id , "تم تعديل القسم بنجاح" , "success")

    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/


/*-------------------------------- start delete supCatigory --------------------------------*/
const delete_supcatigory_controller = async(req , res , next) => {
    try {
        await db.catigorys.destroy({
            where : {
                id : req.params.id
            }
        })
        removeImg(req , "subCatigory_photo/" , req.body.image)
        if(req.body.slug) removeImg(req , "subCatigory_photo/" , req.body.slug)
        returnWithMessage(req , res , "/admin/supCatigory/" , "تم حذف القسم بنجاح" , "danger")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end delete supCatigory --------------------------------*/

/*-------------------------------- start delete supCatigory --------------------------------*/
const active_supcatigory_controller = async(req , res , next) => {
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
            returnWithMessage(req , res , "/admin/supCatigory/" , message , "success")
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end delete supCatigory --------------------------------*/

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
    show_supCatigory_controller,
    add_supCatigory_controller_get,
    add_supCatigory_controller_post,
    get_main_catigory_ajax,
    edit_supCatigory_controller_get,
    edit_supCatigory_controller_post,
    delete_supcatigory_controller,
    active_supcatigory_controller
}