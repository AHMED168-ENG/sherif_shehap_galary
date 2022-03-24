const { promise } = require("bcrypt/promises");
const { tryError } = require("../../Helper/helper");
const db = require("../../models");



const dashporedController = async (req , res , next) => {
    try {
        res.render("backEnd/dashpored" , {
            title : "dashpored",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
        });
    } catch (error) {
        tryError(res , error)
    }
}










module.exports = {
    dashporedController
}