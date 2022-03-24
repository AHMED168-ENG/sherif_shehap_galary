const { check } = require("express-validator")




const userSearchValidation = () => {
    return [

        check("search").notEmpty().withMessage("يجب ادخال البحث الخاص بك"),
        check("mainCatigory").custom(async (value , {req}) => {
            if(value.length > 0 && value[0] == "") {
                throw new error("")
            } else {
                return
            }
        }).withMessage("يجب ادخال البحث الخاص بك"),
    ]
}




module.exports = {
    userSearchValidation
}