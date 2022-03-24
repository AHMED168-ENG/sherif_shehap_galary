const { check, validationResult } = require("express-validator")
const { Op } = require("sequelize")
const { columnSetOrNot } = require("../../Helper/helper")
const db = require("../../models")






/*------------------------- start catigory validation -------------------------*/
const catigoryValidation = () => {
    return [
        check("mainCatigory").custom((value , {req}) => {
            if(req.url == "/addSupCatigory") {
                if(value.length == 1 && value[0] == "") {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("يجب ادخال القسم الفرعي من فضلك"),
        check("catigors[*].name").isString().withMessage("يجب ان يكون الاسم نصا ").notEmpty().withMessage("يجب ادخال اسم القسم").isLength({max : 30 , min : 6}).withMessage("اسم القسم يجب الا يقل عن 6 حروف ولا يجب ان يزيد عن 30")
        .custom(async (value , {req}) => {
            if(!await columnSetOrNot("name" , value , req , "catigorys")) throw new Error("")
            return true
        }).withMessage("هذا المنتج موجود بالفعل"),
        check("catigors[*].description").isString().withMessage("يجب ان يكون الاسم نصا ").notEmpty().withMessage("يجب ادخال وصف القسم"),
        check("image").custom(async (value , {req}) => {
            if(!req.files.image && (req.url == "/addSupCatigory" || req.url == "/addcatigory" )) {
                throw new Error("")
            }
        }).withMessage("يجب ادخال علي الاقل صوره للقسم").custom(async (value , {req}) => {
            if(!req.files.image) return true
            req.files.image.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.image) return true
            if(req.files.image.length > 3) {
                throw new Error("")
            }
        }).withMessage("يجب الا تزيد الصور عن 3 صور").custom(async (value , {req}) => {
            if(!req.files.image) return true
            req.files.image.forEach(element => {
                if(element.size > 200000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 200000 kb"),
        check("slug").custom(async (value , {req}) => {
            if(!req.files.slug) return true
            req.files.slug.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.slug) return true
            req.files.slug.forEach(element => {
                if(element.size > 200000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 200000 kb"),
    ]
}
/*------------------------- end catigory validation -------------------------*/







module.exports = {
    catigoryValidation
}