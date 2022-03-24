const { tryError } = require("../../../Helper/helper")



const vendoerNotAuthonticat = async (req , res , next) => {
    try {
        if(req.cookies.Vendoer) {
            res.redirect("/vendor/home")
        } else {
            next()
        }
    } catch (error) {
        tryError(res)
    }
}









module.exports = {
    vendoerNotAuthonticat,
}