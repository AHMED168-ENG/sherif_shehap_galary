const { tryError } = require("../../../Helper/helper")



const vendoerAuthonticat = async (req , res , next) => {
    try {
        if(!req.cookies.Vendoer) {
            res.redirect("/vendor/signIn")
        } else {
            next()
        }
    } catch (error) {
        tryError(res)
    }
}









module.exports = {
    vendoerAuthonticat,
}