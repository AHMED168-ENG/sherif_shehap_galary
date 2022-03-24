


/*--------------------------- start validation product ---------------------------*/

const { check } = require("express-validator")
const { columnSetOrNot } = require("../../Helper/helper")

const productValidation = () => {
    return [
        check("products[*][productName]").notEmpty().withMessage("يجب ادخال اسم المنتج ").isString().withMessage("هذا الحقل يستقبل نصا فقط").custom(async(value , {req}) => {
            if(!await columnSetOrNot("productName" , value , req , "products" )) throw new Error("")
            return true
        }).withMessage("هذا المنتج موجود بالفعل"),
        check("pieces").notEmpty().withMessage("يجب ادخال عدد قطع المنتج ").isNumeric().withMessage("هذا الحقل يستقبل ارقام فقط").custom(async (value , {req}) => {
            req.body.products.forEach(ele => {
                if(ele.pieceName) {
                    if(ele.pieceName.split(",").length > value) {
                        throw new Error("")
                    }
                }
            })
            return true
        }).withMessage("انت قمت بادخال اسماء القطع ويجب كتابت عددها صحيح"),
        check("products[*][ProductOverview]").notEmpty().withMessage("يجب ادخال لمحه سريعه عن المنتج ").isString().withMessage("هذا الحقل يستقبل نصا فقط"),
        check("products[*][typeOfWood]").notEmpty().withMessage("يجب ادخال الاخشاب المكونه للمنتج "),
        check("products[*].fullDescription").notEmpty().withMessage("يجب ادخال وصف كامل عن المنتج وشرح دقيق "),
        check("products[*][pieceName]").notEmpty().withMessage("يجب ادخال اسماء القطع المكونه للمنتج").custom(async (value , {req}) => {
            if(req.body.pieces) {
                if(req.body.pieces > value.split(",").length) {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("انتا قمت بادخال عدد قطع ويجب عليك كتابت اسماء كل القطع"),
        check("products[*][colors]").notEmpty().withMessage("يجب ادخال الوان القطع المكونه للمنتج").custom(async (value , {req}) => {
            req.body.products.forEach(ele => {
                if(ele.pieceName) {
                    if(ele.pieceName.split(",").length != value.split(",").length) {
                        throw new Error("")
                    }
                }
            })
            return true
        }).withMessage("انتا قمت بادخال اسماء القطع المكونه للمنتج ويجب كتابت الونها بترتيب القطع"),
        check("structure").notEmpty().withMessage("يجب ادخال سعر التركيب اذا كان"),
        check("shipping").notEmpty().withMessage("يجب ادخال سعر التوصيل اذا كان"),
        check("security").notEmpty().withMessage("يجب ادخال الضمان اذا كان"),
        check("descount").notEmpty().withMessage("يجب ادخال الخصم اذا كان"),
        check("keyWord").notEmpty().withMessage("ادخل الكلمات المفتاحيه التي من خلالها يتم البحث عن المنتج"),
        check("price").custom(async (value , {req}) => {
            if(value <= 0 || value == "") {
                throw new Error("")
            }
            return true
        }).withMessage("يجب ادخال سعر المنتج"),
        check("version").notEmpty().withMessage("يجب ادخال اصدار المنتج"),
        check("mainCatigory").custom((value , {req}) => {
            if(req.url == "/addProduct" || req.url == "/vendoer_add_product") {
                if(value.length == 1 && value[0] == "") {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("يجب ادخال قسم المنتج"),
        check("productState").notEmpty().withMessage("يجب ادخال حالت المنتج اذا كان جديد او مستعمل"),
        check("available").notEmpty().withMessage("يجب ادخال هل المنتج موجود ام سيتم العمل عليه"),
        check("dayeOfWork").custom(async (value , {req}) => {
                console.log(req.body.available)
                console.log(req.body.available)
            if((req.body.available == "0" && value == "")) {
                throw new Error("")
            }
        }).withMessage("يجب ادخال عدد ايام العمل علي المنتج"),
        check("dayesOfUsed").custom(async (value , {req}) => {
            if((req.body.productState == "0" && value == "") || (value == undefined && req.body.productState == "0")) {
                throw new Error("")
            }
            return true
        }).withMessage("يجب ادخال عدد ايام الاستعمال"),
        check("available").custom(async (value , {req}) => {
            if((req.body.productState == "0" && value == "") || (value == undefined && req.body.productState == "0")) {
                throw new Error("")
            }
            return true
        }).withMessage("يجب ادخال عدد ايام الاستعمال"),
        check("productImage").custom(async (value , {req}) => {
            if(!req.files.productImage && (req.url != "/edit_products/" + req.params.id && req.url != "/vendoer_edit_product/" + req.params.id) ) {
                throw new Error("")
            }  
            return true
        }).withMessage("يجب ادخال علي الاقل صوره للقسم").custom(async (value , {req}) => {
            if(!req.files.productImage) return true
            req.files.productImage.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.productImage) return true
            if(req.files.productImage.length > 3) {
                throw new Error("")
            }
        }).withMessage("يجب الا تزيد الصور عن 3 صور").custom(async (value , {req}) => {
            if(!req.files.productImage) return true
            req.files.productImage.forEach(element => {
                if(element.size > 2000000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 2000000 kb"),
        check("descriptionImage").custom(async (value , {req}) => {
            if(!req.files.descriptionImage) return true
            req.files.descriptionImage.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.descriptionImage) return true
            if(req.files.descriptionImage.length > 3) {
                throw new Error("")
            }
        }).withMessage("يجب الاتزيد الصور عن 3 صور").custom(async (value , {req}) => {
            if(!req.files.descriptionImage && (req.url != "/edit_products/" + req.params.id && req.url != "/vendoer_edit_product/" + req.params.id)) {
                throw new Error("")
            }  
        }).withMessage("يجب ادخال صوره واحده علي الاقل").custom(async (value , {req}) => {
            if(!req.files.descriptionImage) return true
            if(req.files.descriptionImage.length > 3) {
                throw new Error("")
            }
        }).withMessage("يجب الا تزيد الصور عن 3 صور").custom(async (value , {req}) => {
            if(!req.files.descriptionImage) return true
            req.files.descriptionImage.forEach(element => {
                if(element.size > 2000000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 2000000 kb"),
        check("productVideo").custom(async (value , {req}) => {
            if(!req.files.productVideo) return true
            req.files.productVideo.forEach(element => {
                var arrayExtention = ["dvd","avi" , "mkv" , "mv4" , "mp4" , "mp3" , "flv" , "wmv"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور dvd , avi , mkv , mv4 , mb4 , mp3 , flv`),

    ]
}

/*--------------------------- end validation product ---------------------------*/












module.exports = {
    productValidation
}






















