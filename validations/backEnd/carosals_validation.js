const { check } = require("express-validator")


const carosalValidation = () => {
    return [
        check("location").notEmpty().withMessage("يجب عليك ادخال مكان الكاروسال في الموقع"),
        check("catigory").custom( async (value , {req}) => {
            if(value[0] == '' && req.url == `/addCarosal`) {
                throw new Error("")
            }
        }).withMessage("يجب عليك ادخال القسم الخاص بالكاروسال"),
        check("image").custom(async (value , {req}) => {
            if(req.url == "/addCarosal" && req.files.length == 0) {
                throw new Error("")
            }
        }).withMessage("يجب ادخال صوره الكاروسال").custom(async (value , {req}) => {
            req.files.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(req.files.length > 1) {
                throw new Error("")
            }
        }).withMessage(`يجب ادخال صوره واحده فقط`).custom(async (value , {req}) => {
            req.files.forEach(element => {
                if(element.size > 2000000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 2000000 kb")

    ]
}





module.exports = {
    carosalValidation
}