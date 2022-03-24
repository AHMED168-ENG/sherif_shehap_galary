const { check } = require("express-validator")



/*-------------------------------------- start login validation --------------------------*/
const login_validation = () => {
    return [
        check("email").notEmpty().withMessage("يجب ادخال الايميل الخاص بك").isEmail().withMessage("هذا الحقل يستقبل ايميل فقط"),
        check("password").notEmpty().withMessage("يجب ادخال الرقم السري الخاص بك"),
    ]
}
/*-------------------------------------- end login validation --------------------------*/




module.exports = {
    login_validation
}