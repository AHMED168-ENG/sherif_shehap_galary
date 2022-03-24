const { validationResult } = require("express-validator");
const { tryError, handel_validation_errors, removeImgFiled , Rename_uploade_img_multiFild , returnWithMessage, removeImg, defaultLanguage, getMainCatigory, formateDate} = require("../../Helper/helper");
const db = require("../../models");




/*---------------------------- start page see All user search ------------------------*/
const userSearch = async (req , res , next) => {
    try {
        var userSearch = await db.userSearch.findOne({
            where : {
                userId : req.params.id
            }
        })
        var user = await db.users.findOne({
            where : {
                id : req.params.id
            },
            attrebutes : ["fName , lName" , "id"]
        })

        res.render("backEnd/AllUserSearch/showAllUserSearch_view" , {
            title : "all User Search",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            userSearch : userSearch,
            user,
            date : userSearch ? userSearch.userSearchDate : "",
            formateDate : formateDate
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*---------------------------- start page see All user search ------------------------*/

/*---------------------------- start page add user get search ------------------------*/
const addUserSearch_get = async (req , res , next) => {
    try {
        var user = await db.users.findOne({
            where : {
                id : req.params.id
            }
        })
        if(!user) {
            tryError(res , "هذا المستخدم غير موجود")
            return
        }
        var catigorys = await db.catigorys.scope("allCatigory" , "active").findAll()
        res.render("backEnd/AllUserSearch/addUserSearch_view" , {
            title : "add User Search",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            catigorys,
            defaultLanguage : defaultLanguage()
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*---------------------------- end page add user get search ------------------------*/

/*---------------------------- start page add user Post search ------------------------*/
const addUserSearch_post = async (req , res , next) => {
    try {
        var user = await db.users.findOne({
            where : {
                id : req.params.id
            }
        })
        if(!user) {
            if(req.url == "/AddProductSearch/" + req.params.id) {
                res.redirect("/AllProduct?" + "catigory=" + req.body.mainCatigory[0] + "&search=" + req.body.search )
            } else {
                tryError(res , "هذا المستخدم غير موجود")
            }
            return
        }
        var errors = validationResult(req)["errors"]
        if(errors.length > 0) {
            handel_validation_errors(req , res,errors,"/admin/userSearch/addUserSearch/" + req.params.id)
            return
        }
        var userSearch = await db.userSearch.findOne({
            where : {
                userId : req.params.id
            }
        })
        var catigory = req.body.mainCatigory.length > 0 ? (req.body.mainCatigory[req.body.mainCatigory.length - 1] == "" ? req.body.mainCatigory[req.body.mainCatigory.length - 2] : req.body.mainCatigory[req.body.mainCatigory.length - 1]) : req.body.mainCatigory[0]
        var catigoryName = await getMainCatigory(catigory);
        if(userSearch) {
            if(!userSearch.search.includes(req.body.search)) {
                userSearch.search.push(req.body.search)
                userSearch.catigorys.push(catigory)
                userSearch.catigorysName.push(catigoryName)
                userSearch.userSearchDate.push(Date())
                await db.userSearch.update({
                    search : userSearch.search,
                    catigorys : userSearch.catigorys,
                    catigorysName : userSearch.catigorysName,
                    userSearchDate : userSearch.userSearchDate
                },{
                    where : {
                        userId : req.params.id 
                    },
                })
            }
        } else {
            await db.userSearch.create({
                search : [req.body.search],
                catigorys : [catigory],
                catigorysName : [catigoryName],
                userId : user.id,
                userSearchDate : [Date()]
            })
        }
        if(req.url == "/AddProductSearch/" + req.params.id) {
            res.redirect("/AllProduct?" + "catigory=" + req.body.mainCatigory[0] + "&search=" + req.body.search )
        } else {
            returnWithMessage(req , res ,"/admin/userSearch/addUserSearch/" + req.params.id , "تم اضافت البحث بنجاح"  , "success")
        }
        
    } catch (error) {
        tryError(res , error)
    }
}
/*---------------------------- end page add user post search ------------------------*/

/*---------------------------- start delete search ------------------------*/
const deleteUserSearch = async (req ,res , next) => {
    try {
        var searchHistory = req.body.searchHistory
        var userSearch = await db.userSearch.findOne({
            where : {
                id : req.params.id
            }
        })
        searchHistory.split(",").forEach(ele => {
            if(ele != "") {
                userSearch.catigorys.splice(userSearch.search.indexOf(ele) , 1)
                userSearch.catigorysName.splice(userSearch.search.indexOf(ele) , 1)
                userSearch.userSearchDate.splice(userSearch.search.indexOf(ele) , 1)
                userSearch.search.splice(userSearch.search.indexOf(ele) , 1)
            }
        })
        if(userSearch.search.length == 0) {
            await db.userSearch.destroy({
                where : {
                    id : req.params.id
                }
            })
        } else {
            await db.userSearch.update({
                search : userSearch.search,
                catigorys : userSearch.catigorys,
                catigorysName : userSearch.catigorysName,
                userSearchDate : userSearch.userSearchDate,
            } ,{ where : {
                id : req.params.id
            }})
        }

        returnWithMessage(req , res , "/admin/userSearch/allUserSearch/" + userSearch.userId , "تم الحذف بنجاح" , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*---------------------------- end delete search ------------------------*/






module.exports = {
    userSearch,
    addUserSearch_get,
    addUserSearch_post,
    deleteUserSearch
}