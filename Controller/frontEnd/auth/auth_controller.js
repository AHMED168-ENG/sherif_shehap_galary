const { validationResult } = require("express-validator")
const { tryError, handel_validation_errors, removeImg, uploade_img, Rename_uploade_img, returnWithMessage } = require("../../../Helper/helper")
const fs = require("fs")
const bcrypt = require("bcrypt")
const db = require("../../../models")
const { sendEmail } = require("../../../emails/sendEmails")
const { Op } = require("sequelize")

/*----------------------------------- start signUp controller -----------------------------*/
const signUp_controller_get = async (req , res , next) => {
    try {
        res.render("frontEnd/auth/signUp" , {
            title : "signUp",
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
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "signUp")
            removeImg(req , "users_photo/")
            return
        }
        var image =  Rename_uploade_img(req)
        var user_data = req.body;
        bcrypt.hash(user_data.password , 10 , async function (error , hash) {
            user_data.password = hash;
            user_data.isAdmin = false
            user_data.isVendor = false
            user_data.image = image ? image : "avatar.png"
            user_data.active = user_data.active ? true : false
            await db.users.create(user_data).then((result) => {
                sendEmail(user_data.email , result.id  , user_data.fName, user_data.lName , "تم اضافه حساب خاص بك كمستخدم قم بالتفعيل من هنا" , "activeUserPage" )
                returnWithMessage(req , res , "signUp" , " تم تسجيلك كمستخدم جديد للتفاعل في الموقع تم ارسال رساله تاكيد في الموقع علي ايميل التسجيل"  , "success")
            });    
        });


    } catch (error) {
        tryError(res, error)
    }
}
/*----------------------------------- end signUp controller ------------------------------*/


/*----------------------------------- start signIn controller ------------------------------*/
const signIn_controller_get = async (req , res, next) => {
    try {
        res.render("frontEnd/auth/signIn" , {
            title : "signIn",
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
        var user = await db.users.findOne({
            where : {
                email : {
                    [Op.eq] : userData.email
                }
            },
            attributes : ["active" , "fName" , "number" , "age" , "addres" , "lName" , "image" , "email" , "password" , "id"]
        })
        if(user) {
            var password = bcrypt.compareSync(userData.password , user.password)
            if(!password) {
                returnWithMessage(req , res , "signIn" , "الرقم السري اللذي ادخلته خاطا" , "danger")
            } else {
                if(!user.active) {
                    returnWithMessage(req , res , "signIn" , "هذا الحساب غير مفعل قم بمراجعه الجميل الخاص بك للتفعيل" , "danger")
                } else {
                    var expire = !userData.rememberMe ? {maxAge : 86400000} : {};
                    var message = userData.rememberMe ? "تم تسجيل دخولك بنجاح" :  "تم تسجيل دخولك بنجاح " + "سوف يتم تسجيل الخروج تلقاءي بعد يوم من تسجيلك" ;
                    res.cookie("User" , user , expire)
                    returnWithMessage(req , res , "/home" , message , "success")                
                }
            }
        } else {
            returnWithMessage(req , res , "signIn" , "هذا الايميل لا يمتلك اي حساب", "danger")
        }
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------------------- end signIn controller post ------------------------------*/



/*----------------------------------- start active user page ------------------------------*/
const activeUserPage = async (req , res , next) => {
    try {
        await db.users.update({
            active : true
        } , {
            where : {
                id : req.params.id
            }
        })
        returnWithMessage(req , res , "/signIn" , "تم تفعيلك كمستخدم قم بالتسجيل الان", "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------------------- end active user page ------------------------------*/


/*-----------------------------------  ------------------------------*/
const signOut = async (req , res , next) => {
    try {
        res.clearCookie("User")
        res.clearCookie("Vendoer")
        res.redirect("/signIn")
    } catch (error) {
        
    }
}
/*----------------------------------- start sign Out ------------------------------*/









module.exports = {
    signUp_controller_get,
    signUp_controller_post,
    activeUserPage,
    signIn_controller_get,
    signIn_controller_post,
    signOut,
}