const { check } = require("express-validator")




const productCommentsValidation = () => {
    return [    
        check("comment").notEmpty().withMessage("يجب ادخال الكومنت اللذي تريد التعليق به"),
        check("productId").notEmpty().withMessage("يجب ادخال المنتج اللذي تريد التعليق عليه"),
    ]
}





module.exports = {
    productCommentsValidation
}