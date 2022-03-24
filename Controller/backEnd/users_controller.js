const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { tryError, handel_validation_errors, removeImgFiled , Rename_uploade_img_multiFild , returnWithMessage, removeImg} = require("../../Helper/helper");
const db = require("../../models");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../emails/sendEmails");




/*----------------------- start show Users -------------------------*/
const showUserController = async (req , res , next) => {
    try {
        var users = await db.users.findAll({include : [{model : db.vendorData , as : "userVendorData" , attributes : ["commercFile" , "vendorImage"]}]});
        res.render("backEnd/users/allUsersView" , {
            title : "All Users",
            notification : req.flash("notification")[0],
            users : users,
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end show Users -------------------------*/

/*------------------------- start signUp front End vendor -------------------------------*/
const addUser_controller_get = async (req , res , next) => {
    try {
        res.render("backEnd/users/addUsersView", {
            title : "Add User",
            validationError : req.flash("validationError")[0],
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res)
    }
}
/*------------------------- end signUp front End vendor -------------------------------*/



/*------------------------- start add vendor post -------------------------------*/
const addUser_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "addUsers");
            removeImgFiled([req.files.image , req.files.CommercialRegister , req.files.vindoer_image])
            return
        }
        
        const files = Rename_uploade_img_multiFild([req.files.image , req.files.CommercialRegister , req.files.vendoerImage]);
        var userData = req.body;
        await bcrypt.hash(userData.password , 10 , ((error , hash) => {
            db.users.create({
                fName : userData.fName,
                lName : userData.lName,
                age : userData.age,
                email : userData.email,
                addres : userData.addres,
                password : hash,
                number : userData.mobile,
                image : files.image ? files.image : null,
                active : userData.active ? userData.active : false,
                isAdmin : userData.isAdmin ? userData.isAdmin : false,
                isVendor : userData.isVendor ? userData.isVendor : false,
            }).then(async result => {
               sendEmail(result.email , result.id , result.fName , result.lName , "we send this message to active your user account" , "activeUserPage")
                if(userData.isVendor) {
                    await bcrypt.hash(userData.VendorPassword , 10 , (async (error , passHash) => {
                        await db.vendorData.create({
                            vendorImage : files.vendoerImage ? files.vendoerImage : null,
                            vendoerPassword : userData.VendorPassword ? passHash : null,
                            vendoerEmail : userData.vendorEmail,
                            commercFile : files.CommercialRegister,
                            userId : result.id,
                            mobile : userData.vendorMobile,
                            vendorFname : userData.VendorfName,
                            vendorLname : userData.VendorlName,
                            isActive : userData.isActive ? true : false ,
                        })
                        sendEmail(userData.vendorEmail , result.id  , userData.VendorfName , userData.VendorlName , "we send this message to active your vendoer account" , "vendor/activeUserPage")
                    })) 
                }
            })
            returnWithMessage(req, res , "addUsers" , "تم اضافه عضو جديد للموقع في انتظار التفعيل", "success")
        }))

    } catch (error) {
        tryError(res , errors)
    }
}
/*------------------------- end add vendor post -------------------------------*/

/*----------------------- start edit catigorys -------------------------*/
const editUser_controller_get = async (req , res , next) => {
    try {
        var user = await db.users.findOne({
            where : {
                id : req.params.id
            },
            include : [{model : db.vendorData , as : "userVendorData"}] ,
        })
        res.render("backEnd/users/editUsersView" , {
            title : "Edit user",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            user,
            adminData : req.cookies.Admin,
        })    
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys -------------------------*/

/*----------------------- start edit catigorys post -------------------------*/
const editUser_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            console.log(errors)
            handel_validation_errors(req , res , errors , "/admin/users/editUser/" + req.params.id);
            removeImgFiled([req.files.image , req.files.CommercialRegister , req.files.vendoerImage])
            return
        }

        const files = Rename_uploade_img_multiFild([req.files.image , req.files.CommercialRegister , req.files.vendoerImage]);
        var userData = req.body
        if(files.image) {
            if(userData.oldImage) removeImg(req , "users_photo/" , userData.oldImage)
        }
        if(files.CommercialRegister) {
            if(userData.oldCommercialRegister) removeImg(req , "users_photo/" , userData.oldCommercialRegister)
        }
        if(files.vendoerImage) {
            if(userData.oldVendoerImage) removeImg(req , "users_photo/" , userData.oldVendoerImage)
        }

        await bcrypt.hash(userData.password , 10 , async(error , hashPassword) => {
            await db.users.update({
                password : userData.password ? hashPassword : userData.oldPassword,
                email : userData.email,
                fName : userData.fName,
                lName : userData.lName,
                age : userData.age,
                number : userData.mobile,
                image : files.image ? files.image : userData.oldImage,
                active : userData.active ? true : false,
                isAdmin : userData.isAdmin ? true : false,
                isVendor : userData.isVendor ? true : false,
            },
            {where : {id : req.params.id}})
            if(!userData.isVendor) {
                var vendoer = await db.vendorData.findOne({
                    where :{
                        userId : req.params.id
                    }
                })
                if(vendoer) {
                    await db.vendorData.destroy({
                        where : {
                            userId : req.params.id
                        }
                    })
                    removeImg(req,"users_photo/" , vendoer.commercFile)
                    if(vendoer.vendorImage)removeImg(req,"users_photo/" , vendoer.vendorImage)
                    sendEmail(userData.vendorEmail , null , userData.VendorfName , userData.VendorlName , "تم ازاله الحساب الخاص بك ك تاجر")
                }
            }
            if(userData.cancelUser) {
                sendEmail(userData.email , null , userData.fName , userData.lName , userData.cancelUser)
            }
            await bcrypt.hash(userData.VendorPassword , 10 , async (error , hashPassword) => {
                if(userData.oldCommercialRegister) {
                    await db.vendorData.update({
                        vendorImage : files.vendoerImage ? files.vendoerImage : userData.oldVendoerImage,
                        commercFile : files.CommercialRegister ? files.CommercialRegister : userData.oldCommercialRegister,
                        vendoerPassword : userData.VendorPassword ? hashPassword : userData.OldVendorPassword,
                        vendoerEmail : userData.vendorEmail,
                        mobile : userData.vendorMobile,
                        vendorFname : userData.VendorfName,
                        vendorLname : userData.VendorlName,
                        isActive : userData.isActive ? true : false ,
                    } , {
                        where : {
                            userId : req.params.id
                        }
                    })
                    if(userData.cancelVendoer) {
                        sendEmail(userData.vendorEmail ? userData.vendorEmail : userData.email , userData.VendorfName , userData.VendorlName , userData.cancelVendoer)
                    }
                } else if(userData.isVendor) {
                    await db.vendorData.create({
                        vendorImage : files.vendoerImage ? files.vendoerImage : null,
                        commercFile : files.CommercialRegister,
                        vendoerPassword : userData.VendorPassword,
                        vendoerEmail : userData.vendorEmail,
                        mobile : userData.vendorMobile,
                        vendorFname : userData.VendorfName,
                        vendorLname : userData.VendorlName,
                        isActive : userData.isActive ? true : false,
                        userId : req.params.id
                    }).then((resalt) => {
                        sendEmail(userData.vendorEmail , result.id , userData.VendorfName , userData.VendorlName , "we send this message to active your vendoer account" , "vendor/activeUserPage")
                    })
                }
                returnWithMessage(req, res , "/admin/users/editUser/" + req.params.id , "تم تعديل العضو بنجاح", "success")
            })
        })





    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys post -------------------------*/

/*----------------------- start delete catigorys -------------------------*/
const chang_actvity_user_controller = async (req, res , next) => {
    try {
        var vendor = await db.vendor.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            },
            attributes : [
                "active"
            ]
        })


        await db.vendor.update({
            active :  vendor.active ? false : true
        } , {
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        var message = vendor.active ? "تم الغاء التفعيل بنجاح" : "تم التفعيل بنجاح"
        returnWithMessage(req , res , "/admin/Users/" , message , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete catigorys -------------------------*/

/*----------------------- start delete catigorys -------------------------*/
const delete_user = async (req, res , next) => {
    try {
        await db.vendorData.destroy({
            where : {
                userId : {
                    [Op.eq] : req.params.id
                }
            },
        })

        await db.users.destroy({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        if(req.body.userImage) removeImg(req , "users_photo/" , req.body.userImage)
        if(req.body.userVendoer) removeImg(req , "users_photo/" , req.body.userVendoer)
        if(req.body.userCommercFile) removeImg(req , "users_photo/" , req.body.userCommercFile)
        await sendEmail(req.body.email , req.body.fName , req.body.lName , "لقد قمنا نحن مسؤلي الموقع بازالتك من الموقع لتعديك علي سياست الموقع")
        returnWithMessage(req , res , "/admin/Users/" , "تم حذف المستخدم بنجاح" , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete catigorys -------------------------*/
/*----------------------- start delete catigorys -------------------------*/
const activeUser = async (req, res , next) => {
    try {
        var user = await db.users.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        await db.users.update({
            active : !user.active
        },{
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        var message = ""
        if(!user.active) {
            await sendEmail(user.email , null , user.fName , user.lName , "تم تفعيلك في الموقع كمستخدم")
            message = "تم تفعيلك كمستخدم في الموقع"
        } else {
            await sendEmail(user.email , null , user.fName , user.lName , "تم الغاء تفعيلك في الموقع كمستخدم")
            message = "تم الغاء تفعيلك كمستخدم في الموقع"
        }
        returnWithMessage(req , res , "/admin/Users/" , message , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete catigorys -------------------------*/


/*----------------------- get allVendoers -------------------------*/
const allVendoers = async (req , res , next) => {
    try {
        var vendoers = await db.vendorData.findAll({
            include : [{model : db.users , as : "vendorDataUser" , attributes : ["lName" , "fName" , "email" , "addres"]}
            ], 
            attributes : ["isActive" , "vendorLname" , "vendorFname" , "userId" , "vendoerEmail" , "vendorImage" , "commercFile"]
        });
        res.render("backEnd/vendoers/allVendoersView" , {
            title : "all Vendoer",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            vendoers,
            adminData : req.cookies.Admin,
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end allVendoers -------------------------*/





module.exports = {
    showUserController,
    addUser_controller_get,
    addUser_controller_post,
    editUser_controller_get,
    editUser_controller_post,
    chang_actvity_user_controller,
    delete_user,
    allVendoers,
    activeUser
}