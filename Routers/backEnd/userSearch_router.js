const { userSearch, addUserSearch_get, addUserSearch_post, deleteUserSearch } = require("../../Controller/backEnd/userSearchController")
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const { userSearchValidation } = require("../../validations/backEnd/userSearchValidation");

var router = require("express").Router()





router.get("/allUserSearch/:id" , isAuthonticate , userSearch)
router.get("/addUserSearch/:id" , isAuthonticate , addUserSearch_get)
router.post("/addUserSearch/:id" , isAuthonticate , userSearchValidation() , addUserSearch_post)
router.post("/deleteUserSearch/:id" , isAuthonticate  , deleteUserSearch)





module.exports = {
    userSearch_router : router
}