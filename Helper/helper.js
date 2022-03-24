/*--************ start helpper functions --**********/

const multer = require("multer")
const fs = require("fs")
const db = require("../models")
const { Op , Sequelize , DataTypes} = require("sequelize");
const sequelize = new Sequelize("vendoerEcommerc" , "postgres" , "01024756410ahmed" , {
    host : "localhost",
    "dialect": "postgres",
});
const QueryInterface = sequelize.getQueryInterface();

/*----------------- start try error -------------------*/
const tryError = async (res , message = null) => {
    message = message ? message : "هناك خطا ما في الاتصال ويجب عليك مراجعه مبرمج الموقع",
    res.render("error" , {message : message})
}
/*----------------- end try error -------------------*/



/*----------------- start return with message -------------------*/
const returnWithMessage = async (req , res , url = "", message = "" , type = "" ) => {
    message = message ? message : "هناك خطا ما ويرجي التحقق من الكود",
    type = type ? type : "danger",
    req.flash("notification" , {message : message , type : type})
    res.redirect(url)
}
/*----------------- end return with message -------------------*/


/*------------------------------------ start getDate -------------------------------*/
function getDate(time , type = "") {
    var date = time.toString().split(" ");
    if(!type) {
        date = date[1] + " " + date[2] + " " + date[3] + " " + date[4] + " "
    } else if(type == "time") {
        date =  date[4] + " "
    } else {
        date = date[1] + " " + date[2]  + " " + date[3] 
    }

    return date
}
/*------------------------------------ end getDate -------------------------------*/


/*------------------------------------ start handel validation errors -------------------------------*/
var handel_validation_errors = (req , res,errors , path) => {
    var param = [];
    var newError = {}
    errors.forEach(element => {
        if(!param.includes(element.param)) {
            param.push(element.param)
            newError[element.param] = [element]
        } else {
            newError[element.param].push(element)
        }
    });
    req.flash("validationError" , newError)
    res.redirect(path)
}
/*------------------------------------ end handel validation errors -------------------------------*/

/*------------------------------------ start uploade image -------------------------------*/
const uploade_img = (path , image) => {
   return multer({dest : path}).array(image)
}
const uploade_img_multi_fild = (array , dest) => {
   return multer({dest : dest}).fields(array)
}
/*--------------------------------------------------*/

const Rename_uploade_img_multiFild = (fields) => {
    var fileds_img = {};
    var image = ""
    fields.forEach(element => {
        if(element) {
            element.forEach((element ,i) => {
                var randomNumber = Math.random(1000 , 9000);
                var newPath = element.destination + "/" + randomNumber + element.originalname;
                fs.renameSync(element.path , newPath)
                image += randomNumber + element.originalname + "--"
            });
            fileds_img[element[0].fieldname] = image
            image = ""
        }
    });
    return fileds_img
    
}
/*--------------------------------------------------*/

/*--------------------------------------------------*/

const Rename_uploade_img = (req ) => {
    var image = ""
    req.files.forEach(element => {
        var randomNumber = Math.random(1000 , 9000);
        var newPath = element.destination + "/" + randomNumber + element.originalname;
        fs.renameSync(element.path , newPath)
        image += randomNumber + element.originalname + "--"
    });
    return image
}
/*--------------------------------------------------*/

const removeImgFiled = (fields) => {
    fields.forEach(element => {
        if(element) {
            element.forEach((element ,i) => {
                fs.unlinkSync(element.path)
            });
        }
    });
}
/*--------------------------------------------------*/


/*--------------------------------------------------*/

const removeImg = (req , folder , imgname = "") => {
    if(!imgname) {
        req.files.forEach(element => {
            fs.unlinkSync(element.path)
        });
    } else {
        var imgname = imgname.split("--")
        for(var i = 0 ; i < imgname.length - 1 ; i++) {
            fs.unlinkSync("public/admin/asset/images/" + folder + imgname[i])
        }
    }
}
/*------------------------------------ end uploade image -------------------------------*/


/*------------------------------------ get default Language -------------------------------*/
const defaultLanguage = () => {
    return "en"
}
/*------------------------------------ get default Language -------------------------------*/

/*------------------------------------ get_another_language -------------------------------*/
const get_another_language = async function(table , id) {
    const db = require("../models")
    var allLanguageShourtcut = []
    var language = await db.catigorys.findOne({
        where : {
            id : id
        }
    })
    allLanguageShourtcut.push(language.shourtcut)


    if(language.transitionOf == 0) {
        var languages = await db[table].findAll({
            where : {
                transitionOf : language.id
            }
        })
        await languages.forEach(element => {
            allLanguageShourtcut.push(element.shourtcut)
        });
        var setLangugaes = await GetAddedLanguage(allLanguageShourtcut)
        return {languages , setLangugaes}
    } else {
        const languages = await db[table].findAll({
            where : {
                [Op.or] : [{id : language.transitionOf} , { transitionOf : language.transitionOf}],
                id : {
                    [Op.not] : language.id
                }
            }
        })
        await languages.forEach(element => {
            allLanguageShourtcut.push(element.shourtcut)
        });
        var setLangugaes = await GetAddedLanguage(allLanguageShourtcut)
        return {languages , setLangugaes}
    }
}
/*------------------------------------ if i add another language -------------------------------*/
const GetAddedLanguage = async (arr) => {
    const db = require("../models")
    var setLangugaes = []
    var allLanguageActive = await db.language.scope("allLanguageActive").findAll();
    allLanguageActive.forEach(element => {
        if(!arr.includes(element.shourtcut)) {
            setLangugaes.push(element.shourtcut)
        }
    });
    return setLangugaes
}
/*------------------------------------ if i add another language -------------------------------*/
/*------------------------------------ get_another_language -------------------------------*/


















/*--------------------- start check deletedlanguage ---------------------*/
const checkDeletedlanguage = (shourtcut) => {
    const db = require("../models")
    var language = db.deletedLanguage.findOne({
        where : {
            shourtcut : shourtcut
        }
    })
    if(language) {
        db.deletedLanguage.destroy({
            where : {
                shourtcut : shourtcut
            }
        })    
    }
}
/*--------------------- end check deletedlanguage ---------------------*/


/*--------------------- start count of tabels ---------------------*/
const setAllRowWithLanguage = async(data , table , arrayOfColamsName) => {
    var rowData = {}
    for(var i = 0 ; i < data.length ; i++){

        for(var x = 0 ; x < arrayOfColamsName.length ; x++){
            var tableDefinition = await QueryInterface.describeTable(table)
            if (!await tableDefinition[arrayOfColamsName[x] + "_" + data[i].shourtcut]) {
                await QueryInterface.addColumn(table , arrayOfColamsName[x] + "_" + data[i].shourtcut , {
                    type : DataTypes.TEXT,
                    defaultValue : data[i][arrayOfColamsName[x]]
                })
            }
            rowData[arrayOfColamsName[x] + "_" + data[i].shourtcut] = data[i][arrayOfColamsName[x]]
        }
    }
    return rowData
}

/*--------------------- end count of tabels ---------------------*/

/*--------------------- start validate if column is set or not ---------------------*/
const columnSetOrNot = async (column , value , req , table) => {
    const db = require("../models")
    var test = true
    var id = req.params.id ? req.params.id : 0
    var Language = await db.language.scope("allLanguageActive").findAll()
    for(var i = 0 ; i < Language.length ; i++) {
        var tableDefinition = await QueryInterface.describeTable(table);
        if (tableDefinition[column + "_" + Language[i].shourtcut]) {
            var catigory = await db[table].findAll({
                where : {
                    [Op.and] : {
                        [column + "_" + Language[i].shourtcut] : {[Op.eq] : value},
                        id : {[Op.ne] : id}
                    }
                }
            })
        }
        if(catigory.length > 0) {
            console.log("ddd")
            test = false
        }
    }
    console.log(test)
    return test
}
/*--------------------- end validate if column is set or not ---------------------*/

/*--------------------- start get catigory ---------------------*/
const getMainCatigory = async (id) => {
    var db = require("../models")
    var catigoryFullName = ""
    var test = true
    while(test) {
        var catData = await db.catigorys.findOne({
            where :{
                id : id
            }
        })
        if(!catData) {
            test = false
        } else {
            id = catData.catigoryId
            catigoryFullName += "___" + catData["name_" + defaultLanguage() ]
        }
    }
    catigoryFullName = catigoryFullName.split("___").reverse().join(" -- ")
    return catigoryFullName
    
}
/*--------------------- end get catigory ---------------------*/


/*--------------------- start formate date ---------------------*/
function formateDate(date , type = "date") {
    if(type == "date") {
        return require('moment')(date).format('YYYY-MM-DD')
    } else {
        return require("moment")(date).format('hh-mm-ss')
    }
}
/*--------------------- end formateDate ---------------------*/


/*--------------------- start formate date ---------------------*/
function gerSumOfArray(array) {
    console.log(array)
    var sum = 0
    array.forEach(element => {
        if(element) {
            sum += parseInt(element)
        }
    })
    return sum
}
/*--------------------- end formateDate ---------------------*/






















module.exports = {
    getMainCatigory,
    returnWithMessage,
    getDate,
    tryError,
    handel_validation_errors,
    uploade_img,
    Rename_uploade_img,
    removeImg,
    checkDeletedlanguage,
    uploade_img_multi_fild,
    Rename_uploade_img_multiFild,
    removeImgFiled,
    defaultLanguage,
    get_another_language,
    setAllRowWithLanguage,
    columnSetOrNot,
    formateDate,
    gerSumOfArray,
}