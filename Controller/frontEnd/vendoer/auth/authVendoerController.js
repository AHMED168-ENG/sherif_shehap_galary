const { validationResult } = require("express-validator")
const { tryError, handel_validation_errors, removeImg, Rename_uploade_img, returnWithMessage, removeImgFiled, uploade_img, uploade_img_multi_fild, Rename_uploade_img_multiFild } = require("../../../../Helper/helper")
const bcrypt = require("bcrypt")
const db = require("../../../../models")
const { sendEmail } = require("../../../../emails/sendEmails")
const { Op } = require("sequelize")

/*----------------------------------- start signUp controller -----------------------------*/
const signUp_controller_get = async (req , res , next) => {
    try {
        res.render("frontEnd/auth/vendor/signUp" , {
            title : "vendoer signUp",
            validationError : req.flash("validationError")[0],
            notification : req.flash("notification")[0]
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------------------- end signUp controller ------------------------------*/

/*----------------------------------- start signUp controller -----------------------------*/
const signUp_controller_post = async (req , res , next) => {
    try {
        var vendoer = req.body
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            console.log(errors)

            handel_validation_errors(req , res , errors , "signUp")
            removeImgFiled([req.files.image , req.files.CommercialRegister])
            return
        }
        var userVendoer = await db.vendorData.findOne({
            where : {
                userId : req.cookies.User.id
            }
        })
        if(!userVendoer) {
            var files =  Rename_uploade_img_multiFild([req.files.image , req.files.CommercialRegister])
            vendoer.vendorImage = files.image ? files.image : null
            vendoer.commercFile = files.CommercialRegister
            vendoer.userId = req.cookies.User.id
            vendoer.vendoerPassword = bcrypt.hashSync(vendoer.password , 10)
            vendoer.vendoerEmail = vendoer.email 
            vendoer.mobile = vendoer.mobile
            vendoer.vendorFname = vendoer.fName
            vendoer.vendorLname = vendoer.lName
            vendoer.isActive = false
            await db.vendorData.create(vendoer).then((result) => {
                sendEmail(vendoer.email ,  req.cookies.User.id  , vendoer.fName , vendoer.lName , "تم اضافه حساب خاص بك كتاجر قم بالتفعيل من هنا" , "vendor/activeUserPage")
                returnWithMessage(req , res , "signIn" , "تم تسجيل الحساب بنجاح وتم ارسال رساله علي الجميل الخاص بك للتفعيل"  , "success")
            })
        } else {
            returnWithMessage(req , res , "signIn" , "انت تمتلك حساب باءع بالفعل")
        }



    } catch (error) {
        tryError(res, error)
    }
}
/*----------------------------------- end signUp controller ------------------------------*/


/*----------------------------------- start signIn controller ------------------------------*/
const signIn_controller_get = async (req , res, next) => {
    try {
        res.render("frontEnd/auth/vendor/signIn" , {
            title : "signIn vendoer",
            validationError : req.flash("validationError")[0],
            notification : req.flash("notification")[0]
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------------------- end signIn controller ------------------------------*/

/*----------------------------------- start signIn controller post ------------------------------*/
const signIn_controller_post = async (req , res, next) => {
    try {
        var errors = validationResult(req).errors
        var userData = req.body
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "signIn")
            return
        }
        var vendoer = await db.vendorData.findOne({
            where : {
                vendoerEmail : {
                    [Op.eq] : userData.email
                }
            },
        })
        if(vendoer) {
            var password = bcrypt.compareSync(userData.password , vendoer.vendoerPassword)
            if(!password) {
                returnWithMessage(req , res , "/vendor/signIn" , "الرقم السري اللذي ادخلته خاطا" , "danger")
            } else {
                if(!vendoer.isActive) {
                    returnWithMessage(req , res , "signIn" , "هذا الحساب غير مفعل قم بمراجعه الجميل الخاص بك للتفعيل" , "danger")
                } else {
                    var expire = !userData.rememberMe ? {maxAge : 86400000} : {};
                    var message = userData.rememberMe ? "تم تسجيل دخولك بنجاح" :  "تم تسجيل دخولك بنجاح " + "سوف يتم تسجيل الخروج تلقاءي بعد يوم من تسجيلك" ;
                    res.cookie("Vendoer" , vendoer , expire)
                    returnWithMessage(req , res , "/vendor/home" , message , "success")                
                }
            }
        } else {
            returnWithMessage(req , res , "/vendor/signIn" , "هذا الايميل لا يمتلك اي حساب", "danger")
        }
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------------------- end signIn controller post ------------------------------*/



/*----------------------------------- start active user page ------------------------------*/
const activeUserPage = async (req , res , next) => {
    try {
        await db.vendorData.update({
            isActive : true
        } , {
            where : {
                userId : req.params.id
            }
        })
        await db.users.update({
            isVendor : true
        } , {
            where : {
                id : req.params.id
            }
        })
        res.redirect("/vendor/signIn")
    } catch (error) {
        
    }
}
/*----------------------------------- end active user page ------------------------------*/


/*-----------------------------------  ------------------------------*/
const signOut = async (req , res , next) => {
    try {
        res.clearCookie("Vendoer")
        res.redirect("/vendor/signIn")
    } catch (error) {
        tryError(res)
    }
}
/*----------------------------------- start sign Out ------------------------------*/









module.exports = {
    signUp_controller_get,
    signUp_controller_post,
    activeUserPage,
    signIn_controller_get,
    signIn_controller_post,
    signOut
}