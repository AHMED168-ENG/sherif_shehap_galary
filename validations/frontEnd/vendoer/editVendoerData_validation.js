const { check } = require("express-validator")
const { Op } = require("sequelize")
const db = require("../../../models")




const editVendoerData_validation = () => {
    return [
        check("vendorFname").notEmpty().withMessage("يجب عدم ترك حقل الاسم الاول فارغ"),
        check("vendorLname").notEmpty().withMessage("يجب عدم ترك حقل الاسم الاخير فارغ"),
        check("vendoerEmail").notEmpty().withMessage("يجب عدم ترك حقل الايميل فارغ").isEmail().withMessage("هذا الحقل يستقبل ايميل فقط").custom(async (value , {req}) => {
            if(value != "") {
                var user = await db.vendorData.findOne({
                    where : {
                        vendoerEmail : value,
                        id : {
                            [Op.ne] : req.cookies.Vendoer.id
                        }
                    }
                })
                if(user) {
                    throw new Error("") 
                }
            }
            return true
        }).withMessage("هذا الايميل مسجل بالفعل"),
        check("mobile").notEmpty().withMessage("يجب عدم ترك حقل الموبايل فارغ").isLength({max : 11 , min : 11}),
        check("image").custom(async(value , {req}) => {
            if(!req.files.image) return true
            req.files.image.forEach(element => {
                if(element.size > 200000000) {
                    throw new Error("")
                }
            })
            return true
        }).withMessage("الصوره يجب الا تزيد عن 200000000 kb").custom(async(value , {req}) => {
            if(!req.files.image) return true
              req.files.image.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`),
        check("commercFile").custom(async (value , {req}) => {
            if(!req.files.commercFile) return true
            var arrayExtention = ["pdf"];
            var originalname = req.files.commercFile[0].originalname.split(".");
            var imgExtension = originalname[originalname.length - 1].toLowerCase();
            if(!arrayExtention.includes(imgExtension)) {
                removeImg(req , req.files.commercFile[0].filename)
                throw new Error("")
            }
        }).withMessage(`يجب ان يكون امتداد الملف pdf`).custom(async (value , {req}) => {
            if(!req.files.commercFile) return true
            if(req.files.commercFile[0].size > 13000000) {
                throw new Error("")
            }
        }).withMessage("الملف يجب الا تزيد عن 13 mb"),
    ]
}


const editPassword_validation = () => {
    return [
        check("password").notEmpty().withMessage("يجب عدم ترك الحقل فارغ").custom(async (value , {req}) => {
            var count = 0;
            for(var i = 0 ; i < value.length ; i++) {
                if(isNaN(value[i])) {
                    count++
                }
            }
            if(count < 4) {
                throw new Error()
            }
            return true
        }).withMessage("يجب ان يحتوي الرقم السري عل الاقل علي اربع حروف")
    ]
}





module.exports = {
    editVendoerData_validation,
    editPassword_validation
}