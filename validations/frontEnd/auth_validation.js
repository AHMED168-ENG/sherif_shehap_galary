const { check } = require("express-validator")
const { removeImg } = require("../../Helper/helper")
const db = require("../../models")

/*-------------------------- start auth frontEnd validation -------------------------------*/
const signUp_validation = () => {
    return [
        check("fName").notEmpty().withMessage("ادخل الاسم الاول").isString().withMessage("هذا الحقل يستقبل نصا").isLength({max : 10 , min : 2}).withMessage("الاسم الاول لايجب ان يتعدي 10 احرف ولا يقل عن 2 حرف"),
        check("lName").notEmpty().withMessage("ادخل الاسم الاخير").isString().withMessage("هذا الحقل يستقبل نصا").isLength({max : 10 , min : 2}).withMessage("الاسم الاخير لايجب ان يتعدي 10 احرف ولا يقل عن 2 حرف"),
        check("age").notEmpty().withMessage("ادخل العمر"),
        check("addres").notEmpty().withMessage("ادخل العنوان"),
        check("email").notEmpty().withMessage("ادخل الايميل").isEmail().withMessage("ادخل ايميل صحيح").custom(async (value , {req}) => {
            var user = await db.users.findOne({
                where : {
                    email : value
                }
            })
            if(user) {
                throw new Error()
            }
            return true
        }).withMessage("هذا الايميل مسجل بالفعل"),
        check("number").notEmpty().withMessage("ادخل رقم الموبايل الخاص بك").isLength(11).withMessage("الرقم عباره عن 12 رقم").isNumeric().withMessage("هذا الحقل يستقبل ارقام"),
        check("password").notEmpty().withMessage("ادخل الرقم السري").custom(async (value , {req}) => {
            var count = 0;
            for(var i = 0 ; i < value.length ; i++) {
                if(isNaN(value[i])) {
                    count++
                }
            }
            if(count < 4) {
                throw new Error()
            }
        }).withMessage("الرقم السري يجب ان يحتوي علي حروف"),
        check("confirmPassword").custom(async (value , {req}) => {
            if(value !== req.body.password) {
                throw new Error()
            }
        }).withMessage("الرقم السري غير متطابق"),
        check("image").custom(async (value , {req}) => {
            if(!req.file) return true
            var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
            var originalname = req.file.originalname.split(".");
            var imgExtension = originalname[originalname.length - 1].toLowerCase();
            if(!arrayExtention.includes(imgExtension)) {
                removeImg(req , req.file.filename)
                throw new Error("")
            }
        }).withMessage(`يجب ان يكون امتداد الصوره jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.file) return true
            if(req.file.size > 200000) {
                throw new Error("")
            }
        }).withMessage("الصوره يجب الا تزيد عن 200000 kb"),
        
    ]
}

/*-------------------------- end auth frontEnd validation -------------------------------*/

/*-------------------------- start sign in -------------------------------*/
const signInValidation = () => {
    return [
        check("email").notEmpty().withMessage("ادخل الايميل").isEmail().withMessage("ادخل ايميل صحيح"),
        check("password").notEmpty().withMessage("ادخل الرقم السري")
    ]
}
/*-------------------------- end sign in -------------------------------*/











module.exports = {
    signUp_validation,
    signInValidation
}