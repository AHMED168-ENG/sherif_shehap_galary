const { check } = require("express-validator")
const fs = require("fs")
const { removeImg } = require("../../Helper/helper")
const db = require("../../models")
const language_validation = () => {
    return [
        check("language").notEmpty().withMessage("يجب ادخال اسم اللغه").isString().withMessage("اسم اللغه عباره عن نص"),
        check("shourtcut").notEmpty().withMessage("يجب ادخال اختصار اللغه").isString().withMessage("الاختصار عباره عن نص"),
        check("direction").notEmpty().withMessage("يجب ادخال اتجاه اللغه").isString().withMessage("الاتجاه عباره عن نص"),
        check("language").custom( async (value , {req}) => {
            if(req.url == "/addLanguage") {
                var data = await db.language.findOne({
                    where : {
                        language : value
                    }
                })
                if(data) {
                    throw new Error("")
                }
            } 
        }).withMessage("هذه اللغه موجوده بالفعل "),

        check("country_photo").custom(async (value , {req}) => {
            if(!req.files.length && req.url != "/editLanguage/" + req.params.id) {
                throw new Error("")
            }
            return true
        }).withMessage("يجب ادخال الصوره").custom(async (value , {req}) => {
            if(!req.files.length) return true
            req.files.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصوره jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.length) return true
            req.files.forEach(element => {
                if(element.size > 200000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 200000 kb"),

    ]
}





module.exports = {
    language_validation
}