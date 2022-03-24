const { check } = require("express-validator")
const { Op } = require("sequelize")
const db = require("../../models")




const editPersonalData_validation = () => {
    return [
        check("fName").notEmpty().withMessage("يجب عدم ترك حقل الاسم الاول فارغ"),
        check("lName").notEmpty().withMessage("يجب عدم ترك حقل الاسم الاخير فارغ"),
        check("email").notEmpty().withMessage("يجب عدم ترك حقل الايميل فارغ").isEmail().withMessage("هذا الحقل يستقبل ايميل فقط").custom(async (value , {req}) => {
            if(value != "") {
                var user = await db.users.findOne({
                    where : {
                        email : value,
                        id : {
                            [Op.ne] : req.cookies.User.id
                        }
                    }
                })
                if(user) {
                    throw new Error("") 
                }
            }
            return true
        }).withMessage("هذا الايميل مسجل بالفعل"),
        check("mobile").notEmpty().withMessage("يجب عدم ترك حقل الموبايل فارغ"),
        check("age").notEmpty().withMessage("يجب عدم ترك حقل العمر فارغ"),
        check("image").custom(async(value , {req}) => {
            console.log(req.files)
            if(req.files.length == 0) return true
            req.files.forEach(element => {
                if(element.size > 200000000) {
                    throw new Error("")
                }
            })
            return true
        }).withMessage("الصوره يجب الا تزيد عن 200000000 kb").custom(async(value , {req}) => {
            if(req.files.length == 0) return true
              req.files.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`),
    ]
}






module.exports = {
    editPersonalData_validation
}