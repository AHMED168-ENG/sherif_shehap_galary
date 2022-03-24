const { tryError } = require("../../Helper/helper")



const userNotAuthonticat = async (req , res , next) => {
    try {
        if(req.cookies.User) {
            res.redirect("/home")
        } else {
            next()
        }
    } catch (error) {
        tryError(res)
    }
}










module.exports = {
    userNotAuthonticat
}