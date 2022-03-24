const express = require("express");
const app = express(); // انا لايمكنني استخدام مكتبه sockit.io في حاله express لذلك يجب عمل server باستخدام موديول http
const server = require("http").createServer(app);
const sockitIo = require("socket.io")(server);
const path = require("path");
const models = require("./models");
const paginate = require("express-paginate");
const session = require("express-session");
const flash = require("connect-flash");
const { dashporedRouter } = require("./Routers/backEnd/dashpored_router");
const { languageRouter } = require("./Routers/backEnd/language_Router");
const cookies = require("cookie-parser");
const {
  auth_front_router,
} = require("./Routers/frontEnd/auth/auth_routerUser");
const { authRouter } = require("./Routers/backEnd/auth/auth_router");
const { catigorysRouter } = require("./Routers/backEnd/catigorys_router");
const {
  authVendorRouter,
} = require("./Routers/frontEnd/auth/vendor/authVendoerRouter");
const { supCatigorysRouter } = require("./Routers/backEnd/supCatigory_router");
const { ProductsRouter } = require("./Routers/backEnd/product_router");
const {
  productCommentsRouter,
} = require("./Routers/backEnd/productComments_router");
const { UsersRouters } = require("./Routers/backEnd/UsersRouters");
const { pagesRouterUser } = require("./Routers/frontEnd/pagesRoutersUser");
const { pagesRouterVendoer } = require("./Routers/frontEnd/pagesRoutesVendoer");
const { userSearch_router } = require("./Routers/backEnd/userSearch_router");
const db = require("./models");
const { carosalsRouter } = require("./Routers/backEnd/carosals_routers");
const passport = require("passport");
const facebook = require("passport-facebook").Strategy;

/*--------------------------- start sockit Io ----------------------------------*/
var activeUser = {};
sockitIo.on("connection", (clint) => {
  /* start mack user online  */
  clint.on("activeUser", async (data) => {
    clint._id = data.userId;
    activeUser[data.userId] = {
      id: data.userId,
      lastOpen: null,
    };
    var AlluserFrindes = await db.userFrindes.findOne({
      where: {
        userId: data.userId,
      },
      attributes: ["frindesId"],
    });
    var userFrindActive = {};
    userFrindActive[data.userId] = {
      id: data.userId,
      lastOpen: null,
    };
    if (AlluserFrindes) {
      AlluserFrindes.frindesId.forEach((ele) => {
        if (activeUser[ele] && activeUser[ele].id != "") {
          userFrindActive[ele] = activeUser[ele];
        }
      });
    }
    sockitIo.emit("online", { activeUser: userFrindActive });
  });
  /* end mack user online  */

  /* start create user room to send notification for him */
  clint.on("createYourRoom", (data) => {
    clint.join(data.userId);
  });
  /* end create user room to send notification for him */

  /* start add notification to user  */
  clint.on("addNotificationUser", (data) => {
    clint.broadcast.to(data.userId).emit("addNotificationUser");
  });
  /* end add notification to user  */

  /* start add request to user  */
  clint.on("addRequest", (data) => {
    clint.broadcast.to(data.userId).emit("addRequestNotification");
  });
  /* end add request to user  */

  /* start cancel request to user  */
  clint.on("cancelRequest", (data) => {
    clint.broadcast.to(data.userId).emit("CancelRequestNotification");
  });
  /* end cancel request to user  */

  /* start cancelTowSideRequest to user  */
  clint.on("cancelTowSideRequest", (data) => {
    console.log(typeof data.userId);
    clint.emit("CancelRequestNotificationTowSide");
    clint.broadcast.to(data.userId).emit("CancelRequestNotificationTowSide");
  });
  /* end cancelTowSideRequest to user  */

  /* start acceptTowSideRequest to user  */
  clint.on("acceptTowSideRequest", (data) => {
    clint.emit("acceptRequestNotificationTowSide");
    clint.broadcast.to(data.userId).emit("acceptRequestNotificationTowSide");
  });
  /* end acceptTowSideRequest to user  */

  /* start unFollow to user  */
  clint.on("unFollow", (data) => {
    clint.broadcast.to(data.userId).emit("CancelRequestNotificationTowSide");
  });
  /* end unFollow to user  */

  /* start unFollow to user  */
  clint.on("sendMessageFrindSokit", (data) => {
    clint.broadcast.to(data.frindId).emit("sendMessageFrind", data);
  });
  /* end unFollow to user  */

  /* start clickOnChateToShowMessages */
  clint.on("clickOnChateToShowMessages", (data) => {
    clint.broadcast.to(data.frindId).emit("clickOnChateToShowMessages", data);
  });
  /* end clickOnChateToShowMessages */

  /* start changFrindChateImage */
  clint.on("changFrindChateImage", async (data) => {
    clint.broadcast.to(data.userId).emit("changFrindChateImage", data);
    await db.usersMessage.update(
      { isSeen: true },
      {
        where: {
          to: data.frindId,
          from: data.userId,
        },
      }
    );
  });
  /* end changFrindChateImage */

  clint.on("disconnect", () => {
    activeUser[clint._id] = {
      id: "",
      lastOpen: Date.now(),
    };
    sockitIo.emit("online", { activeUser: activeUser });
  });
});
/*--------------------------- start sockit Io ----------------------------------*/

/*--------------------------- start app.use ----------------------------------*/
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookies());
app.use(
  session({
    secret:
      "هذا الاوبشن خاص بالتشفير يطلب منك نص معين يستخدمه هو عند التشفير وكلما زاد هذا النص زاد الحمايه",
    saveUninitialized: false, // معناها انه عند عمل session لاتقوم بحفظها في الداتابيز الا عندما امرك بذالك
    /*cookie : { // السشن ده هو في الاصل عباره عن cookie لذالك انا اقوم بتحديد بعض القيم لتحديد مده الانتهاء الديفولت هو عند اغلاق المتصفح
        //maxAge : 1 * 60 * 60 * 100, 
    },*/
    resave: true,
  })
);
app.use(flash());
app.use(paginate.middleware(10, 20));
/*--------------------------- end app.use ----------------------------------*/

/*--------------------------- start router  ----------------------------------*/

/*--------------------------- backEnd routers  ----------------------------------*/
app.use("/admin", authRouter);
app.use("/admin", dashporedRouter);
app.use("/admin/language", languageRouter);
app.use("/admin/catigors", catigorysRouter);
app.use("/admin/users", UsersRouters);
app.use("/admin/supCatigory", supCatigorysRouter);
app.use("/admin/products", ProductsRouter);
app.use("/admin/productComments", productCommentsRouter);
app.use("/admin/userSearch", userSearch_router);
app.use("/admin/Carosals", carosalsRouter);

/*--------------------------- backEnd routers  ----------------------------------*/

/*--------------------------- frontEnd routers  ----------------------------------*/

app.use("/", auth_front_router);
app.use("/", pagesRouterUser);
app.use("/vendor", authVendorRouter);
app.use("/vendor", pagesRouterVendoer);

/*--------------------------- frontEnd routers  ----------------------------------*/

app.use((req, res, next) => {
  res.render("error", { message: "this page not hir", title: "Error Page" });
});
/*--------------------------- end route  ----------------------------------*/

server.listen(3099, () => {
  console.log("app started");
});
