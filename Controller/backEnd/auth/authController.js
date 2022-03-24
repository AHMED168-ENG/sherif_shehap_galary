const { validationResult } = require("express-validator");
const { tryError, handel_validation_errors, returnWithMessage } = require("../../../Helper/helper");
const bcrypt = require("bcrypt")
const cookie = require("cookie-parser");
const db = require("../../../models");


/*--------------------------------- start get login Page ------------------------------*/
const login_controller_get = (req , res , next) => {
    try {
        res.render("backEnd/auth/signIn" , {
            title : "admin signIn",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0]
        })
    } catch (error) {
        tryError(res)
    }
}
/*--------------------------------- end get login Page ------------------------------*/



/*--------------------------------- start save login data ------------------------------*/
const login_controller_post = async (req , res , next) => {
    res.clearCookie("isAdmin")
    try {
        var validationErrors = validationResult(req).errors;
        if(validationErrors.length > 0) {
            handel_validation_errors(req , res , validationErrors , "signIn");
            return
        }
        var admin_data = req.body;
        var user = await db.users.findOne({
            where :{
                email : admin_data.email,
                isAdmin : true
            }
        })
        if(user) {
            if(bcrypt.compareSync(admin_data.password , user.password)) {
                var expire = !admin_data.remember_me ? {maxAge : 86400000} : {};
                var message = admin_data.remember_me ? "تم تسجيل دخولك بنجاح" :  "تم تسجيل دخولك بنجاح " + "سوف يتم تسجيل الخروج تلقاءي بعد يوم من تسجيلك" ;
                res.cookie("Admin" , user , expire)
                returnWithMessage(req , res , "dashpored" , message , "success")
            } else {
                returnWithMessage(req , res , "signIn" , "الرقم السري الذي اخلته خاطا" , "danger")
            }
        } else {
            returnWithMessage(req , res , "signIn" , "انت غير مصرح لك بالدخول تواصل مع ادمن الموقع" , "danger")
        }
    } catch (error) {
        tryError(res , error)
    }
}
/*--------------------------------- end save login data ------------------------------*/

/*--------------------------------- start logout ------------------------------*/
const logout_controller = async (req , res , next) => {
    try {
        res.clearCookie("Admin")
        res.redirect("/admin/signIn")
    } catch (error) {
        tryError(req)
    }
}
/*--------------------------------- end logout ------------------------------*/











module.exports = {
    login_controller_get,
    login_controller_post,
    logout_controller
}