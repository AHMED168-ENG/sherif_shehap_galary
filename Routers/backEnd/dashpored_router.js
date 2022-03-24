const { dashporedController } = require("../../Controller/backEnd/dashporedController")
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");

const router = require("express").Router()





router.get("/dashpored" , isAuthonticate , dashporedController)












module.exports = {
    dashporedRouter : router
}