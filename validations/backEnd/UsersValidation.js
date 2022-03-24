const { check, validationResult } = require("express-validator");
const db = require("../../models");
const { Op } = require("sequelize");

/*------------------------------ signUp validation --------------------------------------*/
const usersValidation = (req , res , next) => {
    return [
        check("fName").notEmpty().withMessage("ادخل الاسم الاول").isString().withMessage("هذا الحقل يستقبل نصا").isLength({max : 10 , min : 2}).withMessage("الاسم الاول لايجب ان يتعدي 10 احرف ولا يقل عن 2 حرف"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("lName").notEmpty().withMessage("ادخل الاسم الاخير").isString().withMessage("هذا الحقل يستقبل نصا").isLength({max : 10 , min : 2}).withMessage("الاسم الاخير لايجب ان يتعدي 10 احرف ولا يقل عن 2 حرف"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("age").notEmpty().withMessage("ادخل العمر"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("email").notEmpty().withMessage("ادخل الايميل").isEmail().withMessage("ادخل ايميل صحيح").custom(async (value , {req}) => {
            var id = req.params.id ? req.params.id : 0
            var user = await db.users.findOne({
                where : {
                    email : value,
                    id : {
                        [Op.ne] : id
                    }
                }
            })
            if(user) {
                throw new Error()
            }
        }).withMessage("هذا الايميل مسجل بالفعل"),
        check("VendorfName").custom(async(value , {req}) => {
            if(req.body.isVendor) {
                if(!value) {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("ادخل الاسم الاول"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("VendorlName").custom(async(value , {req}) => {
            if(req.body.isVendor) {
                if(!value) {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("ادخل الاسم الاخير"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("vendorMobile").custom(async(value , {req}) => {
            if(req.body.isVendor) {
                if(!value) {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("ادخل الموبيل الخاص بك كتاجر").custom(async(value , {req}) => {
            if(req.body.isVendor && (value.length > 11 || value.length < 11)) {
                throw new Error("")
            } else {
                return true
            }
        }).withMessage("ادخل رقم الموبايل الخاص بالتاجر مكون من 11 رقم"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("vendorEmail").custom(async (value , {req}) => {
            if(!req.body.isVendor) {
                return true
            } else {
                if(!value) {
                    throw new Error("")
                }
            }

        }).withMessage("ادخل الايميل الخاص بحساب التاجر ").custom(async (value , {req}) => {
            var id = req.params.id ? req.params.id : 0
            if(!value) return true
            var vendor = await db.vendorData.findOne({
                where : {
                    vendoerEmail : value,
                    userId : {
                        [Op.ne] : id
                    }
                }
            })
            if(vendor) {
                throw new Error("")
            }
            return true
        }).withMessage("هذا الايميل مسجل بالفعل"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("VendorPassword").custom(async (value , {req}) => {
            if(req.body.isVendor && !value && !req.body.oldCommercialRegister) {
                throw new Error("")
            } 
            return true
        }).withMessage("يجب ادخال الرقم السري").custom(async (value , {req}) => {
            if(!req.body.VendorPassword) return true
            var count = 0;
            for(var i = 0 ; i < value.length ; i++) {
                if(isNaN(value[i])) {
                    count++
                }
            }
            if(count < 4 && req.url != "/editUser/" + req.params.id) {
                throw new Error()
            }
            return true
        }).withMessage("الرقم السري يجب ان يحتوي علي الاقل علي خمس حروف"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("vendoerConfirmPassword").custom(async (value , {req}) => {
            if(value !== req.body.VendorPassword  && req.body.VendorPassword) {
                throw new Error("")
            }
            return true
        }).withMessage("الرقم السري غير متطابق"),

////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("mobile").notEmpty().withMessage("ادخل رقم الموبايل الخاص بك").isLength(11).withMessage("الرقم عباره عن 12 رقم").isNumeric().withMessage("هذا الحقل يستقبل ارقام"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("addres").notEmpty().withMessage("ادخل العنوان من فضلك"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("licenc").custom((value , {req}) => {
            if(req.url == "/signUp") {
                if(!value) {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("يجب قراءه الملاحظات و الموافقه عليها"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("password").custom(async (value , {req})=> {
            if(value == "" && req.url != "/editUser/" + req.params.id) {
                throw new Error()
            }
        }).withMessage("ادخل الرقم السري").custom(async (value , {req}) => {
            if(!req.body.password) return true
            var count = 0;
            for(var i = 0 ; i < value.length ; i++) {
                if(isNaN(value[i])) {
                    count++
                }
            }
            if(count < 4 && req.url != "/editUser/" + req.params.id) {
                throw new Error()
            }
        }).withMessage("الرقم السري يجب ان يحتوي علي الاقل علي خمس حروف"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("confirmPassword").custom(async (value , {req}) => {
            if(value !== req.body.password && req.body.password) {
                throw new Error()
            }
        }).withMessage("الرقم السري غير متطابق"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("image").custom(async (value , {req}) => {
            if(!req.files.image) return true
            var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
            var originalname = req.files.image[0].originalname.split(".");
            var imgExtension = originalname[originalname.length - 1].toLowerCase();
            if(!arrayExtention.includes(imgExtension)) {
                removeImg(req , req.files.image[0].filename)
                throw new Error("")
            }
        }).withMessage(`يجب ان يكون امتداد الصوره jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.image) return true
            if(req.files.image[0].size > 500000) {
                throw new Error("")
            }
        }).withMessage("الصوره يجب الا تزيد عن 500000 kb"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("CommercialRegister").custom(async (value, {req}) => {
            if(req.body.isVendor && !req.files.CommercialRegister && !req.body.oldCommercialRegister) throw new Error("")
            return true
        }).withMessage("ادخل السجل التجارس الخاص بك"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
        check("CommercialRegister").custom(async (value , {req}) => {
            if(!req.files.CommercialRegister) return true
            var arrayExtention = ["pdf"];
            var originalname = req.files.CommercialRegister[0].originalname.split(".");
            var imgExtension = originalname[originalname.length - 1].toLowerCase();
            if(!arrayExtention.includes(imgExtension)) {
                removeImg(req , req.files.CommercialRegister[0].filename)
                throw new Error("")
            }
        }).withMessage(`يجب ان يكون امتداد الملف pdf`).custom(async (value , {req}) => {
            if(!req.files.CommercialRegister) return true
            if(req.files.CommercialRegister[0].size > 13000000) {
                throw new Error("")
            }
        }).withMessage("الملف يجب الا تزيد عن 13 mb"),
////////////////////////////////////////////////////////////////////////////////////////////////////////
     

    ]
}
/*------------------------------ signUp validation --------------------------------------*/





module.exports = {
    usersValidation
}