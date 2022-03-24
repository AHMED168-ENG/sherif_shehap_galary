const { check } = require("express-validator")
const db = require("../../../models")




const signUpVendoerValidation = () => {
    return [
        check("fName").notEmpty().withMessage("ادخل الاسم الاول الخاص بالتاجر").isString().withMessage("هذا الحقل يستقبل نصا فقط"),
        check("lName").notEmpty().withMessage("ادخل الاسم الاخير الخاص بالتاجر").isString().withMessage("هذا الحقل يستقبل نصا فقط"),
        check("mobile").notEmpty().withMessage("ادخل الموبايل الخاص بك كتاجر").isLength({max : 11 , min : 11}).withMessage("ادخل رقم الهاتف مكون من 11 رقم"),
        check("email").notEmpty().withMessage("يجب ادخال الايميل الخاص بك").isEmail().withMessage("هذا الحقل يستقبل ايميل فقط").custom(async (value , {req}) => {
            var vendoer = await db.vendorData.findOne({
                where : {
                    vendoerEmail : value
                }
            })
            if(vendoer) {
                throw new Error("")
            }
            return true
        }).withMessage("هذا الايميل يمتلك حساب بالفعل"),
        //////////////////////////////////////////////////////
        check("password").notEmpty().withMessage("يجب ادخال الرقم السري").custom(async (value , {req}) => {
            if(!value) return true
            var count = 0;
            for(var i = 0 ; i < value.length ; i++) {
                if(isNaN(value[i])) {
                    count++
                }
            }
            if(count < 4 && req.url != "/editUser/" + req.params.id) {
                throw new Error()
            }
        }).withMessage("يجب ان يحتوي الرقم السري علي الاقل علي 4 حروف"),
        //////////////////////////////////////////////////////
        check("confirmPassword").custom(async (value , {req}) => {
            if(!req.body.password) return true
            if(value != req.body.password) {
                throw new Error("")
            }
            return true
        }).withMessage("الرقم السري غير متطابق"),
        //////////////////////////////////////////////////////
        check("licenc").notEmpty().withMessage("يجب الموافقه علي سياسه الموقع اذا لم تقراها فيجب قراءه سياسه الموقع"),
        //////////////////////////////////////////////////////
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
        ///////////////////////////////////////////////////////////////////
        check("CommercialRegister").custom(async (value, {req}) => {
            if(!req.files.CommercialRegister) throw new Error("")
            return true
        }).withMessage("ادخل السجل التجارس الخاص بك"),
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
    ]
}






const signInVendoerValidation = () => {
    return [
        check("email").notEmpty().withMessage("ادخل الايميل").isEmail().withMessage("ادخل ايميل صحيح"),
        check("password").notEmpty().withMessage("ادخل الرقم السري")
    ]
}





module.exports = {
    signInVendoerValidation,
    signUpVendoerValidation
}