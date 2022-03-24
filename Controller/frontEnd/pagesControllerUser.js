const {
  tryError,
  defaultLanguage,
  getMainCatigory,
  formateDate,
  handel_validation_errors,
  removeImg,
  removeImgFiled,
  uploade_img,
  Rename_uploade_img,
  returnWithMessage,
  Rename_uploade_img_multiFild,
} = require("../../Helper/helper");
const { sequelize, Op } = require("sequelize");
const db = require("../../models");
const paginate = require("express-paginate");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const emoji = require("node-emoji");

/*------------------ start main page ------------------*/
const MainPageController = async (req, res, next) => {
  try {
    var mainCatigory = await db.catigorys
      .scope("allCatigory", "active")
      .findAll({
        limit: 4,
        order: [["createdAt", "desc"]],
      });
    var supCatigory = await db.catigorys
      .scope("allSupCatigory", "active")
      .findAll({
        limit: 4,
        order: [["createdAt", "desc"]],
      });
    var productWithHigeRate = await db.products
      .scope("activeProducts")
      .findAll({
        order: [["sumRate", "desc"]],
      });
    var newestProduct = await db.products.scope("activeProducts").findAll({
      limit: 10,
      order: [["createdAt", "desc"]],
    });

    var allCatigory = await db.catigorys
      .scope("allCatigory", "active")
      .findAll({
        order: [["createdAt", "desc"]],
      });
    if (req.cookies.User) {
      var userSearch = await db.userSearch.findOne({
        where: {
          userId: req.cookies.User.id,
        },
      });
      var arr = [];
      if (userSearch) {
        for (var i = 0; arr.length < 10; i++) {
          var random = Math.floor(Math.random() * userSearch.search.length);
          if (!arr.includes(userSearch.search[random])) {
            arr.push(userSearch.search[random]);
          }
          if (userSearch.search.length + 10 < i) break;
        }
      }

      var productRelatedWithSearch = await db.products
        .scope("activeProducts")
        .findAll({
          limit: 10,
          where: {
            [Op.or]: [
              { keyWord: { [Op.in]: arr } },
              { ["productName_" + defaultLanguage()]: { [Op.in]: arr } },
              { ["ProductOverview_" + defaultLanguage()]: { [Op.in]: arr } },
              { ["fullDescription_" + defaultLanguage()]: { [Op.in]: arr } },
            ],
          },
          order: [["createdAt", "desc"]],
        });

      arr = [];
      if (userSearch) {
        for (var i = 0; arr.length < 6; i++) {
          var random = Math.floor(Math.random() * userSearch.catigorys.length);
          if (!arr.includes(userSearch.catigorys[random])) {
            arr.push(userSearch.catigorys[random]);
          }
          if (userSearch.catigorys.length + 10 < i) break;
        }
      }

      var catigorysRelatedWithSearch = await db.catigorys
        .scope("active")
        .findAll({
          limit: 4,
          order: [["createdAt", "desc"]],
          where: {
            id: {
              [Op.in]: arr,
            },
          },
        });

      /*------------------------ start part of User_Reserved_Products -------------------------*/
      var User_Reserved_Products = await db.shopingCart.findAll({
        where: {
          userId: req.cookies.User.id,
        },
      });

      var User_Reserved_ProductsLength = 0;
      User_Reserved_Products.forEach((ele) => {
        User_Reserved_ProductsLength += ele.count;
      });
      /*------------------------ end part of User_Reserved_Products -------------------------*/
    } else {
      var productRelatedWithSearch = [];
    }
    var spechialVendoer = await db.users.scope("active").findAll({
      include: [
        {
          model: db.vendorData,
          as: "userVendorData",
          where: { isActive: true },
          attributes: ["vendorImage", "vendorFname", "vendorLname"],
        },
      ],
      attributes: ["addres", "id"],
    });

    var carosalsTop = await db.carosals.scope("carosalActive").findAll({
      where: {
        locationInProject: "HOME_TOP",
      },
    });

    res.render("frontEnd/Userpages/home", {
      title: "main Page",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      defaultLang: defaultLanguage(),
      url: req.url,
      mainCatigory,
      mainCatigoryDescount: await getMaxDescount(mainCatigory),
      supCatigoryDescount: await getMaxDescount(supCatigory),
      supCatigory,
      productWithHigeRate,
      allCatigory,
      productRelatedWithSearch,
      catigorysRelatedWithSearch,
      newestProduct,
      spechialVendoer,
      carosalsTop,
      User_Reserved_ProductsLength,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end main page ------------------*/

/*------------------ start shoping cart ------------------*/
const shopingCart_controller = async (req, res, next) => {
  try {
    var allCatigory = await db.catigorys
      .scope("allCatigory", "active")
      .findAll({
        order: [["createdAt", "desc"]],
      });
    var User_Reserved_Products = await db.shopingCart.findAll({
      include: [
        {
          model: db.products,
          as: "shipingCardProduct",
          where: { active: "true" },
          required: true,
          attributes: [
            "productName_" + defaultLanguage(),
            "colors_" + defaultLanguage(),
            "productImage",
            "shipping",
            "structure",
            "catigory",
            "pieceName_" + defaultLanguage(),
            "price",
            "descount",
            "sumRate",
            "userId",
            "id",
          ],
          include: [
            {
              model: db.catigorys,
              as: "productCate",
              attributes: ["name_" + defaultLanguage()],
              require: false,
            },
            {
              model: db.vendorData,
              as: "productVendor",
              attributes: ["vendorFname", "vendorLname", "userId"],
              required: false,
            },
          ],
        },
      ],
      where: {
        userId: req.params.id,
      },
      attributes: ["count", "createdAt", "count"],
      order: [["createdAt", "asc"]],
    });
    var allCatigoryProducts = [];
    var quantity = 0;
    if (User_Reserved_Products.length > 0) {
      User_Reserved_Products.forEach((ele) => {
        allCatigoryProducts.push(ele.shipingCardProduct.catigory);
        quantity += parseInt(ele.count);
      });
    }

    var productWithHigRate = await db.products.scope("activeProducts").findAll({
      order: [["sumRate", "desc"]],
      limit: 20,
    });
    var productRelated = [];
    if (allCatigoryProducts.length > 0) {
      productRelated = await db.catigorys.scope("active").findAll({
        include: [{ model: db.products, as: "catigorysProduct" }],
        where: {
          [Op.or]: [
            {
              id: {
                [Op.in]: allCatigoryProducts,
              },
            },
            {
              catigoryId: {
                [Op.in]: allCatigoryProducts,
              },
            },
          ],
        },
        limit: 20,
      });
    }

    var User_Reserved_ProductsLength = 0;
    User_Reserved_Products.forEach((ele) => {
      User_Reserved_ProductsLength += ele.count;
    });

    res.render("frontEnd/Userpages/shopingCard", {
      title: "shoping card Page",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      defaultLang: defaultLanguage(),
      url: req.url,
      User_Reserved_Products,
      quantity,
      productWithHigRate,
      productRelated,
      allCatigory,
      User_Reserved_ProductsLength,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end shoping cart ------------------*/

/*------------------ start pay for websit ------------------*/
const payForWebsit = async (req, res, next) => {
  try {
    console.log(req.body);
    res.render("frontEnd/Userpages/payForWebsit", {
      title: "pay for websit",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      defaultLang: defaultLanguage(),
      url: req.url,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------ end pay for websit ------------------*/

/*------------------ start catigoryShow_controller ------------------*/
const catigoryShow_controller = async (req, res, next) => {
  try {
    var catigory = await db.catigorys.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!catigory) {
      tryError(res, "هذا القسم غير متوفر");
    }
    var supCatigory = await db.catigorys.scope("allSupCatigory").findAll({
      where: {
        catigoryId: req.params.id,
      },
      limit: 4,
    });
    var AllsupCatigory = await db.catigorys.scope("allSupCatigory").findAll({
      where: {
        catigoryId: req.params.id,
      },
      order: [["createdAt", "desc"]],
    });
    var lastForCatigory = await db.catigorys.scope("allSupCatigory").findAll({
      order: [["createdAt", "desc"]],
      limit: 4,
    });
    var suggestCatigory = await db.catigorys.scope("allSupCatigory").findAll({
      order: [["createdAt", "desc"]],
      limit: 4,
    });
    var products = await db.products.scope("activeProducts").findAll({
      include: [
        { model: db.productRating, as: "productRate", attributes: ["sumRate"] },
      ],
      where: {
        catigory: req.params.id,
      },
    });

    var allCatigory = await db.catigorys
      .scope("allCatigory", "active")
      .findAll({
        order: [["createdAt", "desc"]],
      });

    /*------------------------ start part of User_Reserved_Products -------------------------*/
    if (req.cookies.User) {
      var User_Reserved_ProductsLength = 0;
      var User_Reserved_Products = await db.shopingCart.findAll({
        where: {
          userId: req.cookies.User.id,
        },
      });
      User_Reserved_Products.forEach((ele) => {
        User_Reserved_ProductsLength += ele.count;
      });
    }
    /*------------------------ end part of User_Reserved_Products -------------------------*/

    res.render("frontEnd/Userpages/catigoryDetails", {
      title: "catigory show",
      suggestCatigory,
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      defaultLang: defaultLanguage(),
      url: req.url,
      catigory: catigory,
      mainCatigory: await getMainCatigory(catigory.id),
      supCatigory,
      products,
      AllsupCatigory,
      lastForCatigory,
      allCatigory,
      User_Reserved_ProductsLength,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end catigoryShow_controller ------------------*/

/*------------------ start productDetails controller ------------------*/
const productDetails_controller = async (req, res, next) => {
  try {
    var product = await db.products.scope("activeProducts").findOne({
      include: [
        {
          model: db.vendorData,
          as: "productVendor",
          attributes: ["userId", "vendorFname", "vendorLname"],
          required: false,
          where: { isActive: true },
        },
      ],
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      tryError(res, "هذا المنتج غير متوفر");
      return;
    }

    var productWithHigRate = await db.products.scope("activeProducts").findAll({
      order: [["sumRate", "desc"]],
      limit: 20,
    });

    var productRelated = await db.catigorys.scope("active").findAll({
      include: [{ model: db.products, as: "catigorysProduct" }],
      where: {
        [Op.or]: [{ id: product.catigory }, { catigoryId: product.catigory }],
      },
      limit: 20,
    });

    var productRate = await db.productRating.findOne({
      where: {
        productId: req.params.id,
      },
    });
    var sumOfRate = 0;
    var arrayOfstar = [0, 0, 0, 0, 0];
    if (productRate) {
      if (req.cookies.User) {
        var userRate = productRate.usersId.includes(
          parseInt(req.cookies.User.id)
        )
          ? productRate.ratings[
              productRate.usersId.indexOf(parseInt(req.cookies.User.id))
            ]
          : 0;
      }
      productRate.ratings.forEach((ele) => {
        sumOfRate += ele;
        if (ele == 1) arrayOfstar[0] += 1;
        if (ele == 2) arrayOfstar[1] += 1;
        if (ele == 3) arrayOfstar[2] += 1;
        if (ele == 4) arrayOfstar[3] += 1;
        if (ele == 5) arrayOfstar[4] += 1;
      });
    } else {
      var userRate = 0;
    }

    var allCatigory = await db.catigorys
      .scope("allCatigory", "active")
      .findAll({
        order: [["createdAt", "desc"]],
      });

    var productComments = await db.productComments.findAll({
      include: [
        {
          model: db.users,
          as: "CommentUser",
          attributes: ["image", "fName", "lName", "id"],
        },
      ],
      where: {
        productId: req.params.id,
        active: true,
      },
      order: [
        ["likes", "asc"],
        ["createdAt", "desc"],
      ],
      limit: 3,
      attributes: [
        "comment",
        "likes",
        "desLikes",
        "createdAt",
        "id",
        "desLikesUser",
        "likesUser",
      ],
    });

    /*-- ----------------- start part of productsIdInShopingCard ------------------*/
    if (req.cookies.User) {
      var User_Reserved_ProductsLength = 0;
      var productsIdInShopingCard = {};
      var User_Reserved_Products = await db.shopingCart.findAll({
        where: {
          userId: req.cookies.User.id,
        },
      });
      User_Reserved_Products.forEach((ele) => {
        User_Reserved_ProductsLength += ele.count;
        productsIdInShopingCard[ele.productId] = { count: ele.count };
      });
    }
    /*-- ----------------- end part of productsIdInShopingCard ------------------*/

    res.render("frontEnd/Userpages/productDetails", {
      title: "product details",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      defaultLang: defaultLanguage(),
      url: req.url,
      product: product,
      fullCatigory: await getMainCatigory(product.catigory),
      productRate,
      sumOfRate,
      arrayOfstar,
      productComments,
      formateDate: formateDate,
      userRate,
      productWithHigRate,
      allCatigory,
      productRelated,
      productsIdInShopingCard,
      User_Reserved_ProductsLength,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end productDetails controller ------------------*/

/*------------------ start getProductAllComments controller ------------------*/
const getProductAllComments = async (req, res, next) => {
  try {
    var product = await db.products.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["productName_" + defaultLanguage(), "id"],
    });
    if (!product) {
      tryError(res, "هذا المنتج غير موجود");
    }
    var { limit, page } = req.query;
    var order = req.query.filter
      ? [[req.query.filter, req.query.type]]
      : [["createdAt", "desc"]];

    var productComments = await db.productComments.findAndCountAll({
      include: [
        {
          model: db.users,
          as: "CommentUser",
          attributes: ["image", "fName", "lName", "id"],
        },
      ],
      where: {
        productId: req.params.id,
        active: true,
        comment: {
          [Op.like]: req.query.search ? "%" + req.query.search + "%" : "%",
        },
      },
      limit: limit,
      offset: (parseInt(page) - 1) * page,
      order: order,
      attributes: [
        "comment",
        "likes",
        "desLikes",
        "createdAt",
        "id",
        "desLikesUser",
        "likesUser",
      ],
    });

    var allCatigory = await db.catigorys
      .scope("allCatigory", "active")
      .findAll({
        order: [["createdAt", "desc"]],
      });

    if (req.cookies.User) {
      var User_Reserved_Products = await db.shopingCart.findAll({
        where: {
          userId: req.cookies.User.id,
        },
      });
      var User_Reserved_ProductsLength = 0;
      User_Reserved_Products.forEach((ele) => {
        User_Reserved_ProductsLength += ele.count;
      });
    }

    res.render("frontEnd/Userpages/allCommentsProduct", {
      title: "All Catigory Product",
      notification: req.flash("notification")[0],
      User_Reserved_ProductsLength,
      user: req.cookies.User,
      defaultLang: defaultLanguage(),
      url: req.url,
      productComments: productComments.rows,
      formateDate: formateDate,
      product,
      page,
      pages: paginate.getArrayPages(req)(
        limit,
        Math.ceil(productComments.count / limit),
        page
      ),
      query: req.query,
      allCatigory,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end getProductAllComments controller ------------------*/

/*------------------ start show search ------------------*/
const getDataSearch_ajax = async (req, res, next) => {
  try {
    var dataSearch = await db.products.findAll({
      limit: 10,
      where: {
        [Op.or]: {
          ["ProductOverview_" + defaultLanguage()]: {
            [Op.like]: "%" + req.body.search + "%",
          },
          ["fullDescription_" + defaultLanguage()]: {
            [Op.like]: "%" + req.body.search + "%",
          },
          ["productName_" + defaultLanguage()]: {
            [Op.like]: "%" + req.body.search + "%",
          },
          keyWord: {
            [Op.like]: "%" + req.body.search + "%",
          },
        },
      },
    });
    res.send(dataSearch);
  } catch (error) {
    tryError(res);
  }
};
/*------------------ end show search ------------------*/

/*------------------ get all product in search controller ------------------*/
const getAllProduct = async (req, res, next) => {
  try {
    var { limit, page } = req.query;
    var typeWood = req.query.typeWood ? req.query.typeWood.split(",") : [];
    var filterData = {
      catigory: req.query.catigory == 0 ? { [Op.gt]: 0 } : req.query.catigory,
      [Op.and]: [
        {
          [Op.or]: [
            {
              ["ProductOverview_" + defaultLanguage()]: {
                [Op.like]: `%${req.query.search}%`,
              },
            },
            {
              ["productName_" + defaultLanguage()]: {
                [Op.like]: `%${req.query.search}%`,
              },
            },
            {
              ["fullDescription_" + defaultLanguage()]: {
                [Op.like]: `%${req.query.search}%`,
              },
            },
            {
              keyWord: {
                [Op.like]: `%${req.query.search}%`,
              },
            },
          ],
        },
      ],

      shipping: req.query.shipping ? null : { [Op.or]: [{ [Op.gt]: 0 }, null] },
      productState: req.query.productState
        ? req.query.productState == "old"
          ? false
          : true
        : {
            [Op.or]: [true, false],
          },
      dayesOfUsed:
        req.query.productState == "old"
          ? req.query.dayOfUsed
            ? { [Op.lte]: req.query.dayOfUsed }
            : { [Op.gt]: 0 }
          : { [Op.or]: [{ [Op.gt]: 0 }, null] },
      [Op.or]: req.query.typeWood
        ? [
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 1 ? 0 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 2 ? 1 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 3 ? 2 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 4 ? 3 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 5 ? 4 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 6 ? 5 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 7 ? 6 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 8 ? 7 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 9 ? 8 : 0]}%`,
              },
            },
            {
              ["typeOfWood_" + defaultLanguage()]: {
                [Op.like]: `%${typeWood[typeWood.length >= 10 ? 9 : 0]}%`,
              },
            },
          ]
        : { ["typeOfWood_" + defaultLanguage()]: { [Op.like]: "%%" } },
      price: req.query.priceCheck
        ? req.query.priceCheck == "more"
          ? { [Op.gt]: 8000 }
          : {
              [Op.and]: [
                { [Op.lte]: req.query.priceCheck.split(",")[0] },
                { [Op.gte]: req.query.priceCheck.split(",")[1] },
              ],
            }
        : { [Op.gte]: 0 },
      available: req.query.vilabelity
        ? req.query.vilabelity == "true"
          ? true
          : false
        : { [Op.or]: [true, false] },
      dayeOfWork:
        req.query.vilabelity == "false"
          ? req.query.dayOfWork
            ? req.query.dayOfWork == "more"
              ? { [Op.gte]: 7 * 30 }
              : { [Op.lte]: parseInt(req.query.dayOfWork) * 30 }
            : { [Op.gte]: 0 }
          : { [Op.or]: [{ [Op.gt]: 0 }, null] },
      sumRate: req.query.rateCheck
        ? { [Op.lte]: req.query.rateCheck }
        : { [Op.gte]: 0 },
      descount: req.query.descount
        ? req.query.descount == "descount"
          ? { [Op.ne]: null }
          : null
        : { [Op.or]: [null, { [Op.ne]: null }] },
      pay: req.query.pay
        ? req.query.pay == "webSit"
          ? 1
          : 0
        : { [Op.or]: [1, 0] },
      security: req.query.security
        ? req.query.security == "yes"
          ? { [Op.ne]: null }
          : null
        : { [Op.or]: [null, { [Op.ne]: null }] },
    };

    var allProduct = await db.products.scope("activeProducts").findAndCountAll({
      limit: limit,
      offset: (page - 1) * limit,
      order: [
        req.query.asideFilter
          ? req.query.asideFilter.split(",")
          : ["createdAt", "asc"],
      ],
      where: filterData,
    });

    var allCatigory = await db.catigorys
      .scope("allCatigory", "active")
      .findAll({
        order: [["createdAt", "desc"]],
      });
    var allSupCatigory = await db.catigorys
      .scope("allSupCatigory", "active")
      .findAll({
        where: {
          catigoryId: req.query.catigory,
        },
        order: [["createdAt", "desc"]],
      });

    var mainCatigoryName = await db.catigorys.scope("active").findOne({
      where: {
        id: req.query.catigory,
      },
      attributes: ["name_" + defaultLanguage()],
      limit: 6,
    });

    var allProductLength = await db.products
      .scope("activeProducts")
      .findAndCountAll({
        limit: 0,
      });

    var productRelated = await db.catigorys.scope("active").findAll({
      include: [{ model: db.products, as: "catigorysProduct" }],
      where: {
        [Op.or]: [
          { id: req.query.catigory },
          { catigoryId: req.query.catigory },
        ],
        id: { [Op.ne]: req.query.catigory },
      },
      limit: 20,
    });

    /*-- ----------------- start part of productsIdInShopingCard ------------------*/
    var User_Reserved_ProductsLength = 0;
    if (req.cookies.User) {
      var User_Reserved_Products = await db.shopingCart.findAll({
        where: {
          userId: req.cookies.User.id,
        },
      });
      User_Reserved_Products.forEach((ele) => {
        User_Reserved_ProductsLength += ele.count;
      });
    }
    /*-- ----------------- start part of productsIdInShopingCard ------------------*/

    res.render("frontEnd/Userpages/allProductSearch", {
      title: "All Products",
      notification: req.flash("notification")[0],
      user: req.cookies.User,
      defaultLang: defaultLanguage(),
      url: req.url,
      allProduct: allProduct,
      allCatigory,
      allSupCatigory,
      formateDate: formateDate,
      pages: paginate.getArrayPages(req)(
        limit,
        Math.ceil(allProduct.count / limit),
        page
      ),
      page,
      mainCatigoryName,
      User_Reserved_ProductsLength,
      allProductLength: allProductLength.count,
      query: req.query,
      productRelated,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get all product in search controller ------------------*/

/*------------------ get my account controller ------------------*/
const membersPosts = async (req, res, next) => {
  try {
    var Posts = await db.userPosts.findAndCountAll({
      limit: 4,
      order: [["createdAt", "desc"]],
      include: [
        {
          model: db.users,
          as: "postsUser",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.users,
          as: "postsUserTo",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.likesPosts,
          as: "PostsLikes",
          attributes: ["usersId", "types"],
          required: false,
        },
        {
          model: db.postComments,
          as: "postComments",
          where: { to: null },
          limit: 3,
          required: false,
          order: [["createdAt", "asc"]],
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              where: { active: true },
              attributes: ["id", "fName", "lName", "image", "active"],
            },
            {
              model: db.postComments,
              as: "supComments",
              limit: 1,
              include: [
                {
                  model: db.users,
                  as: "postCommentUser",
                  where: { active: true },
                  attributes: ["id", "fName", "lName", "image", "active"],
                },
              ],
            },
          ],
        },
      ],
    });

    var GetEmojin = function (name) {
      return emoji.get(name);
    };

    function getSomeOfUserEmoji(array) {
      var arr = [];
      for (var i = 0; i < array.length; i++) {
        if (!arr.includes(array[i])) {
          arr.push(array[i]);
        }
        if (arr.length >= 3) break;
      }
      return arr;
    }
    var x = {};

    var allEmoji = require("../../jsonFileForEmoji V2");
    allEmoji.forEach((ele) => {
      if (!x[ele.category]) {
        x[ele.category] = ele.emoji;
      }
    });

    var notificationRequestNumber = 0;
    var userfrindesData = [];

    /* ----------- satrt get user notification --------------*/
    var userNotification = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
      },
      order: [["createdAt", "desc"]],
      limit: 10,
    });
    var userMessagesNotSeen = await db.usersMessage.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });
    var userNotificationNotSeen = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });
    /* ----------- end get user notification --------------*/

    /* ----------- start chate aside --------------*/

    var chateAside = await db.usersChat.findAll({
      include: [
        { model: db.users, as: "FromChatUser", attributes: ["id", "image"] },
        { model: db.users, as: "chatUser", attributes: ["id", "image"] },
      ],
      where: {
        from: req.cookies.User.id,
        isSaved: true,
      },
      attributes: ["id"],
      order: [["createdAt", "desc"]],
    });

    /* ----------- start chate aside --------------*/

    var moreDataForUser = await db.moreDataForUser.findOne({
      where: {
        userId: req.cookies.User.id,
      },
    });
    var userFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.cookies.User.id,
      },
      attributes: ["frindesId"],
    });
    var userFrindesData = await db.users.findAll({
      where: {
        id: {
          [Op.in]: userFrindes.frindesId,
        },
      },
    });

    var User_Reserved_Products = await db.shopingCart.findAll({
      where: {
        userId: req.cookies.User.id,
      },
    });
    var User_Reserved_ProductsLength = 0;
    User_Reserved_Products.forEach((ele) => {
      User_Reserved_ProductsLength += ele.count;
    });
    res.render("frontEnd/Userpages/membersPosts", {
      title: req.cookies.User.fName,
      notification: req.flash("notification")[0],
      UserCookie: req.cookies.User,
      User_Reserved_ProductsLength,
      defaultLang: defaultLanguage(),
      date: formateDate,
      url: req.url,
      Posts,
      userFrindesData,
      data: [],
      GetEmojin: GetEmojin,
      getSomeOfUserEmoji: getSomeOfUserEmoji,
      x,
      notificationRequestNumber,
      moreDataForUser,
      userNotificationNotSeen,
      userNotification,
      userMessagesNotSeen,
      chateAside,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get my account controller ------------------*/
/*------------------ get my account controller ------------------*/
const getMyAccount = async (req, res, next) => {
  try {
    var user = await db.users.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!user) {
      tryError(res, "هذا المستخدم غير موجود");
    }
    var Posts = await db.userPosts.findAndCountAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ from: user.id }, { to: user.id }],
          },
          {
            [Op.and]: [
              { from: { [Op.ne]: user.id } },
              { to: { [Op.eq]: user.id } },
            ],
          },
        ],
      },
      limit: 4,
      order: [["createdAt", "desc"]],
      include: [
        {
          model: db.users,
          as: "postsUser",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.users,
          as: "postsUserTo",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.likesPosts,
          as: "PostsLikes",
          attributes: ["usersId", "types"],
          required: false,
        },
        {
          model: db.postComments,
          as: "postComments",
          where: { to: null },
          limit: 3,
          required: false,
          order: [["createdAt", "asc"]],
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              where: { active: true },
              attributes: ["id", "fName", "lName", "image", "active"],
            },
            {
              model: db.postComments,
              as: "supComments",
              limit: 1,
              include: [
                {
                  model: db.users,
                  as: "postCommentUser",
                  where: { active: true },
                  attributes: ["id", "fName", "lName", "image", "active"],
                },
              ],
            },
          ],
        },
      ],
    });

    var images = await db.userPosts.findAll({
      where: {
        image: {
          [Op.ne]: null,
        },
        [Op.or]: [
          {
            [Op.and]: [{ from: user.id }, { to: user.id }],
          },
          {
            [Op.and]: [{ from: { [Op.ne]: user.id } }, { to: user.id }],
          },
        ],
      },
      limit: 9,
      attributes: ["image"],
      order: [["createdAt", "asc"]],
    });
    var GetEmojin = function (name) {
      return emoji.get(name);
    };

    function getSomeOfUserEmoji(array) {
      var arr = [];
      for (var i = 0; i < array.length; i++) {
        if (!arr.includes(array[i])) {
          arr.push(array[i]);
        }
        if (arr.length >= 3) break;
      }
      return arr;
    }
    var x = {};

    var allEmoji = require("../../jsonFileForEmoji V2");
    allEmoji.forEach((ele) => {
      if (!x[ele.category]) {
        x[ele.category] = ele.emoji;
      }
    });

    var ifFrind = "no";
    var notificationRequestNumber = 0;
    var userfrindesData = [];

    /* ----------- start get user Frindes --------------*/
    var usersFrind = await db.userFrindes.findOne({
      where: {
        userId: req.cookies.User.id,
      },
    });
    /* ----------- end get user Frindes --------------*/

    /* ----------- start get frind Frindes --------------*/
    var Frinds = await db.userFrindes.findOne({
      where: {
        userId: req.params.id,
      },
    });
    /* ----------- end get frind Frindes --------------*/

    /* ----------- start get frind Frindes users Data --------------*/
    if (Frinds) {
      var userId = Frinds.frindesId.slice(0, 10);
      userfrindesData = await db.users.findAll({
        where: {
          id: {
            [Op.in]: userId,
          },
        },
        attributes: ["image", "id", "fName", "lName"],
      });
    }
    /* ----------- end get frind Frindes users Data --------------*/

    /* ----------- start get user request --------------*/
    var frindRequest1 = await db.frindesRequest.findOne({
      where: {
        to: req.cookies.User.id,
      },
    });
    /* ----------- end get user request --------------*/

    /* ----------- start get frind request --------------*/
    var frindRequest2 = await db.frindesRequest.findOne({
      where: {
        to: req.params.id,
      },
    });
    if (frindRequest1) {
      frindRequest1.notificationSeen.forEach((ele, i) => {
        if (ele == false) {
          notificationRequestNumber += 1;
        }
      });
    }
    /* ----------- end get frind request --------------*/

    /* ----------- satrt get user notification --------------*/
    var userNotification = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
      },
      order: [["createdAt", "desc"]],
      limit: 10,
    });
    var userMessagesNotSeen = await db.usersMessage.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });
    var userNotificationNotSeen = await db.userNotification.findAll({
      where: {
        to: req.cookies.User.id,
        isSeen: false,
      },
    });
    /* ----------- end get user notification --------------*/

    /* ----------- start chate aside --------------*/

    var chateAside = await db.usersChat.findAll({
      include: [
        { model: db.users, as: "FromChatUser", attributes: ["id", "image"] },
        { model: db.users, as: "chatUser", attributes: ["id", "image"] },
      ],
      where: {
        from: req.cookies.User.id,
        isSaved: true,
      },
      attributes: ["id"],
      order: [["createdAt", "desc"]],
    });

    /* ----------- start chate aside --------------*/

    if (usersFrind && usersFrind.frindesId.includes(parseInt(req.params.id))) {
      ifFrind = "yes";
    } else {
      if (
        (frindRequest1 &&
          frindRequest1.from.includes(parseInt(req.params.id))) ||
        (frindRequest2 &&
          frindRequest2.from.includes(parseInt(req.cookies.User.id)))
      ) {
        ifFrind = "pending";
      }
    }

    var moreDataForUser = await db.moreDataForUser.findOne({
      where: {
        userId: req.params.id,
      },
    });

    res.render("frontEnd/Userpages/userProfile", {
      title: req.cookies.User.fName,
      notification: req.flash("notification")[0],
      user,
      UserCookie: req.cookies.User,
      defaultLang: defaultLanguage(),
      date: formateDate,
      url: req.url,
      Posts,
      images,
      data: [],
      GetEmojin: GetEmojin,
      getSomeOfUserEmoji: getSomeOfUserEmoji,
      x,
      ifFrind,
      notificationRequestNumber,
      userfrindesData,
      moreDataForUser,
      userNotificationNotSeen,
      userNotification,
      userMessagesNotSeen,
      chateAside,
    });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get my account controller ------------------*/

/*------------------ get getSearchUserData controller ------------------*/
const getSearchUserData = async (req, res, next) => {
  try {
    var users = await db.users.findAll({
      where: {
        fName: { [Op.like]: `%${req.body.search}%` },
        id: { [Op.ne]: req.body.id },
      },
      attributes: ["image", "fName", "lName", "id"],
    });
    res.send(users);
  } catch (error) {
    tryError(req);
  }
};
/*------------------ get getSearchUserData controller ------------------*/

/*------------------ edit personal information controller ------------------*/
const editPersonalInformationGet = async (req, res, next) => {
  try {
    var frindRequest1 = await db.frindesRequest.findOne({
      where: {
        to: req.cookies.User.id,
      },
    });
    var frindRequestCount = frindRequest1 ? frindRequest1.from.length : 0;

    res.render("frontEnd/Userpages/editPersonalInformation", {
      title: req.cookies.User.fName,
      notification: req.flash("notification")[0],
      validationError: req.flash("validationError")[0],
      UserCookie: req.cookies.User,
      url: req.url,
      frindRequestCount,
    });
  } catch (error) {
    tryError(res);
  }
};
/*------------------ edit personal information controller ------------------*/

/*------------------ edit personal information controller ------------------*/
const editPersonalInformationPost = async (req, res, next) => {
  try {
    var errors = validationResult(req).errors;
    if (errors.length > 0) {
      handel_validation_errors(req, res, errors, "/editPersonalInformation");
      removeImg(req);
      return;
    }
    var image = Rename_uploade_img(req);
    var userData = req.body;
    if (image) {
      userData.image = image;
      removeImg(req, "users_photo/", req.body.oldImage);
    } else {
      userData.image = req.body.oldImage;
    }
    userData.password = req.body.newPassword
      ? bcrypt.hashSync(req.body.newPassword, 10)
      : req.body.oldPassword;
    await db.users.update(userData, {
      where: {
        id: req.cookies.User.id,
      },
    });
    res.clearCookie("User");
    returnWithMessage(
      req,
      res,
      "/signIn",
      "تم تعديل البيانات بنجاح ويجب التسجيل ",
      "success"
    );
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ edit personal information controller ------------------*/

/*-------------------------------------------- start part of posts ----------------------------------------*/

/*----------------------- start part add post ajax --------------------------*/
const addPostAjax = async (req, res, next) => {
  try {
    var files = Rename_uploade_img_multiFild([
      req.files.image,
      req.files.video,
    ]);
    await db.userPosts
      .create({
        post: req.body.post,
        from: req.body.from,
        to: req.body.to ? req.body.to : req.body.from,
        image: files.image ? files.image : null,
        video: files.video ? files.video : null,
        commentNumber: 0,
      })
      .then(async (result) => {
        var from = await db.users.findOne({
          where: {
            id: req.body.from,
          },
          attributes: ["image", "id", "fName", "lName"],
        });
        var to = await db.users.findOne({
          where: {
            id: req.body.to,
          },
          attributes: ["image", "id", "fName", "lName"],
        });

        res.send([result, from, to]);
      });
  } catch (error) {
    tryError(res, error);
  }
};
/*----------------------- end part add post ajax --------------------------*/

/*------------------ edit personal information controller ------------------*/
const editPostAjax = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
      attributes: ["image", "video"],
    });

    var files = Rename_uploade_img_multiFild([
      req.files.image,
      req.files.video,
    ]);
    if (files.image) {
      if (post.image) removeImg(req, "posts/", post.image);
    }
    if (files.video) {
      if (post.video) removeImg(req, "posts/", post.video);
    }
    await db.userPosts.update(
      {
        post: req.body.post,
        image: files.image ? files.image : post.image,
        video: files.video ? files.video : post.video,
      },
      {
        where: {
          id: req.body.postId,
        },
      }
    );
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
    });
    res.send(post);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ edit personal information controller ------------------*/

/*------------------ add likes ------------------*/
const AddLikesAjax = async (req, res, next) => {
  try {
    var userLikes = await db.likesPosts.findOne({
      where: {
        postId: req.body.postId,
      },
    });

    if (userLikes) {
      if (userLikes.usersId.includes(parseInt(req.body.userId))) {
        if (req.body.type != "") {
          userLikes.types.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1,
            req.body.type
          );
        } else {
          userLikes.types.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1
          );
          userLikes.createdAtLikes.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1
          );
          userLikes.usersId.splice(
            userLikes.usersId.indexOf(parseInt(req.body.userId)),
            1
          );

          if (userLikes.types.length == 0) {
            await db.likesPosts.destroy({
              where: {
                postId: req.body.postId,
              },
            });
          }
        }
      } else {
        userLikes.types.push(req.body.type);
        userLikes.usersId.push(req.body.userId);
        userLikes.createdAtLikes.push(new Date());
        console.log(req.body.postId);
        if (req.body.frindId != req.cookies.User.id) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.frindId,
            type: `${req.body.type}__Likes__${req.body.postHead}__${req.body.postId}`,
            isSeen: false,
            isRead: false,
          });
        }
      }
      await db.likesPosts.update(
        {
          usersId: userLikes.usersId,
          types: userLikes.types,
          createdAtLikes: userLikes.createdAtLikes,
        },
        {
          where: {
            id: userLikes.id,
          },
        }
      );

      res.send(userLikes.types);
    } else {
      await db.likesPosts
        .create({
          usersId: [req.body.userId],
          postId: req.body.postId,
          types: [req.body.type],
          createdAtLikes: [new Date()],
        })
        .then((result) => {
          res.send([result.types]);
        });
      if (req.body.frindId != req.cookies.User.id) {
        await db.userNotification.create({
          userId: req.body.userId,
          to: req.body.frindId,
          type: `${req.body.type}__Likes__${req.body.postHead}__${req.body.postId}`,
          isSeen: false,
          isRead: false,
        });
      }
    }
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ add likes ------------------*/

/*------------------ add comment on posts ------------------*/
const addCommentOnPosts = async (req, res, next) => {
  try {
    var images = Rename_uploade_img(req);
    await db.postComments
      .create({
        comment: req.body.comment,
        userId: req.body.userId,
        postId: req.body.postId,
        to: req.body.to ? req.body.to : null,
        images: images ? images : null,
      })
      .then(async (result) => {
        var comment = await db.postComments.findOne({
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              attributes: ["fName", "lName", "image", "id"],
            },
          ],
          where: {
            id: result.id,
          },
          attributes: ["comment", "id"],
        });

        var post = await db.userPosts.findOne({
          where: {
            id: req.body.postId,
          },
        });

        if (req.body.frindId != req.body.userId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.frindId,
            type: `comment__Comment__${
              req.body.to ? req.body.comment : post.post
            }__${req.body.to}__${comment.id}__${req.body.postId}`,
            isSeen: false,
            isRead: false,
          });
        }

        await db.userPosts.update(
          {
            commentNumber: post.commentNumber
              ? parseInt(post.commentNumber) + 1
              : 1,
          },
          {
            where: {
              id: req.body.postId,
            },
          }
        );
        res.send([comment, formateDate(comment.createdAt)]);
      });
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ add comment on posts ------------------*/

/*------------------ delete comment on posts ------------------*/
const deleteCommentAjax = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
      attributes: ["commentNumber"],
    });
    post = parseInt(post.commentNumber);
    async function getCommentId(id) {
      var comments = await db.postComments.findAll({
        where: {
          to: id,
        },
        attributes: ["id", "to", "postId", "images"],
      });
      return comments;
    }

    function setIds(test) {
      while (test.length > 0) {
        test.forEach(async (ele) => {
          await db.postComments.destroy({
            where: {
              id: ele.id,
            },
          });
          if (ele.images) removeImg(req, "commentsPhoto/", ele.images);
          post -= 1;
          await db.userPosts.update(
            { commentNumber: post },
            {
              where: {
                id: req.body.postId,
              },
            }
          );

          setIds(await getCommentId(ele.id));
        });
        test = [];
      }
    }
    setIds(await getCommentId(req.body.commentId));
    var comment = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
      attributes: ["images"],
    });

    if (comment.images) removeImg(req, "commentsPhoto/", comment.images);

    await db.postComments.destroy({
      where: {
        id: req.body.commentId,
      },
    });
    post -= 1;
    await db.userPosts.update(
      { commentNumber: post },
      {
        where: {
          id: req.body.postId,
        },
      }
    );
    res.send("delete success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ delete comment on posts ------------------*/

/*------------------ update comment on posts ------------------*/
const editCommentAjax = async (req, res, next) => {
  try {
    var image = Rename_uploade_img(req);
    var comment = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
      attributes: ["images"],
    });
    console.log(req.body.numberOFimage);
    if (image) {
      if (comment.images) removeImg(req, "commentsPhoto/", comment.images);
    } else if (req.body.numberOFimage) {
      image = "";
      console.log(req.body.numberOFimage);
      console.log(comment.images);
      comment.images.split("--").forEach((ele, i) => {
        console.log(i);
        console.log(ele);
        if (ele.trim() == "") return;
        if (req.body.numberOFimage.split(",").includes(i + "")) {
          removeImg(req, "commentsPhoto/", ele + "--");
        } else {
          image += ele + "--";
        }
      });
    } else {
      image = comment.images;
    }

    await db.postComments.update(
      {
        comment: req.body.comment,
        images: image ? image : null,
      },
      {
        where: {
          id: req.body.commentId,
        },
      }
    );

    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ update comment on posts ------------------*/

/*------------------ getCommentData on posts ------------------*/
const getCommentData = async (req, res, next) => {
  try {
    var commentData = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
      attributes: ["images", "comment"],
    });
    res.send(commentData);
  } catch (error) {
    tryError(res);
  }
};
/*------------------ getCommentData on posts ------------------*/

/*------------------ GetMore comment on posts ------------------*/
const getMoreComments = async (req, res, next) => {
  try {
    var moreComments = await db.postComments.findAll({
      offset: req.body.offset,
      required: false,
      include: [
        {
          model: db.users,
          as: "postCommentUser",
          required: false,
          attributes: ["id", "image", "fName", "lName"],
        },
        {
          model: db.postComments,
          as: "supComments",
          limit: 1,
          required: false,
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              attributes: ["id", "image", "fName", "lName"],
            },
          ],
        },
      ],
      where: { to: req.body.id ? req.body.id : null, postId: req.body.postId },
      order: [["createdAt", "asc"]],
      limit: 3,
    });
    res.send(moreComments);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ GetMore comment on posts ------------------*/

/*------------------ add Likes on comment ------------------*/
const AddLikesOnCommentsAjax = async (req, res, next) => {
  try {
    var comment = await db.postComments.findOne({
      where: {
        id: req.body.commentId,
      },
    });

    if (comment.usersLikes) {
      if (comment.usersLikes.includes(parseInt(req.body.userId))) {
        if (req.body.type != "") {
          comment.LikesTypes.splice(
            comment.usersLikes.indexOf(parseInt(req.body.userId)),
            1,
            req.body.type
          );
        } else {
          comment.LikesTypes.splice(
            comment.usersLikes.indexOf(parseInt(req.body.userId)),
            1
          );
          comment.usersLikes.splice(
            comment.usersLikes.indexOf(parseInt(req.body.userId)),
            1
          );
        }
      } else {
        comment.LikesTypes.push(req.body.type);
        comment.usersLikes.push(req.body.userId);
        if (req.body.userId != req.body.frindId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.frindId,
            type: `${req.body.type}__LikeComment__${comment.comment}__${comment.id}`,
            isSeen: false,
            isRead: false,
          });
        }
      }
    } else {
      comment.LikesTypes = [req.body.type];
      comment.usersLikes = [req.body.userId];
    }
    await db.postComments.update(
      {
        usersLikes: comment.usersLikes,
        LikesTypes: comment.LikesTypes,
      },
      {
        where: {
          id: req.body.commentId,
        },
      }
    );
    res.send(comment.LikesTypes);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ add Likes on comment ------------------*/

/*------------------ get some of posts ------------------*/
const GetSomeOfPosts = async (req, res, next) => {
  try {
    var where = !req.body.place
      ? {
          [Op.or]: [
            {
              [Op.and]: [{ from: req.body.userId }, { to: req.body.userId }],
            },
            {
              [Op.and]: [
                { from: { [Op.ne]: req.body.userId } },
                { to: { [Op.eq]: req.body.userId } },
              ],
            },
          ],
        }
      : {};
    var Posts = await db.userPosts.findAndCountAll({
      where: where,
      offset: req.body.offset,
      limit: 4,
      order: [["createdAt", "desc"]],
      include: [
        {
          model: db.users,
          as: "postsUser",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.users,
          as: "postsUserTo",
          required: false,
          attributes: ["id", "fName", "lName", "image"],
        },
        {
          model: db.likesPosts,
          as: "PostsLikes",
          attributes: ["usersId", "types"],
          required: false,
        },
        {
          model: db.postComments,
          as: "postComments",
          where: { to: null },
          limit: 3,
          required: false,
          order: [["createdAt", "asc"]],
          include: [
            {
              model: db.users,
              as: "postCommentUser",
              where: { active: true },
              attributes: ["id", "fName", "lName", "image", "active"],
            },
            {
              model: db.postComments,
              as: "supComments",
              limit: 1,
              include: [
                {
                  model: db.users,
                  as: "postCommentUser",
                  where: { active: true },
                  attributes: ["id", "fName", "lName", "image", "active"],
                },
              ],
            },
          ],
        },
      ],
    });
    res.send(Posts);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get some of posts ------------------*/

/*------------------ deletePost_ajax ------------------*/
const deletePost_ajax = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
    });

    if (post.image) {
      removeImg(req, "posts/", post.image);
    }
    if (post.video) {
      removeImg(req, "posts/", post.video);
    }

    await db.userPosts.destroy({
      where: {
        id: req.body.postId,
      },
    });

    var allCommentPost = await db.postComments.findAll({
      where: {
        postId: req.body.postId,
      },
    });
    allCommentPost.forEach(async (ele) => {
      await db.postComments.destroy({
        where: {
          id: ele.id,
        },
      });
    });

    var allLikesPost = await db.likesPosts.findAll({
      where: {
        postId: req.body.postId,
      },
    });
    allLikesPost.forEach(async (ele) => {
      await db.likesPosts.destroy({
        where: {
          id: ele.id,
        },
      });
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(300);
  }
};
/*------------------ deletePost_ajax ------------------*/

/*------------------ get post Data ------------------*/
const getPost_Data = async (req, res, next) => {
  try {
    var post = await db.userPosts.findOne({
      where: {
        id: req.body.postId,
      },
    });
    res.send(post);
  } catch (error) {
    res.sendStatus(300);
  }
};
/*------------------ get post Data ------------------*/

/*------------------ addFrind ------------------*/
async function addRequest2(frindes, userId, userFrindId) {
  try {
    frindes.RespondDirection.splice(
      frindes.frindesId.indexOf(parseInt(userFrindId)),
      1
    );
    frindes.frindRequestTime.splice(
      frindes.frindesId.indexOf(parseInt(userFrindId)),
      1
    );
    frindes.frindesId.splice(
      frindes.frindesId.indexOf(parseInt(userFrindId)),
      1
    );
    await db.userFrindes.update(
      {
        RespondDirection: frindes.RespondDirection,
        frindRequestTime: frindes.frindRequestTime,
        frindesId: frindes.frindesId,
      },
      {
        where: {
          userId: userId,
        },
      }
    );
    if (frindes.frindesId.length == 0) {
      await db.userFrindes.destroy({
        where: {
          userId: userId,
        },
      });
    }
  } catch (error) {
    tryError(res);
  }
}

const addRequest = async (req, res, next) => {
  try {
    usersFrind = await db.userFrindes.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    frindFrinds = await db.userFrindes.findOne({
      where: {
        userId: req.body.userFrindId,
      },
    });
    if (
      usersFrind &&
      usersFrind.frindesId.includes(parseInt(req.body.userFrindId))
    ) {
      await addRequest2(usersFrind, req.body.userId, req.body.userFrindId);
      await addRequest2(frindFrinds, req.body.userFrindId, req.body.userId);
      await db.userNotification.create({
        userId: req.body.userId,
        to: req.body.userFrindId,
        type: "R.UnFollow__R.UnFollow",
        isSeen: false,
        isRead: false,
      });
    } else {
      var frindesRequest = await db.frindesRequest.findOne({
        where: {
          to: req.body.userFrindId,
        },
      });

      var frindesRequest2 = await db.frindesRequest.findOne({
        where: {
          to: req.body.userId,
        },
      });

      if (
        frindesRequest &&
        frindesRequest.from.includes(parseInt(req.body.userId))
      ) {
        frindesRequest.date.splice(
          frindesRequest.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest.notificationSeen.splice(
          frindesRequest.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest.from.splice(
          frindesRequest.from.indexOf(parseInt(req.body.userId)),
          1
        );
        if (frindesRequest.from.length == 0) {
          await db.frindesRequest.destroy({
            where: {
              to: req.body.userFrindId,
            },
          });
        }
        if (frindesRequest.to == req.body.userId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.userFrindId,
            type: "R.Cancel__R.Cancel",
            isSeen: false,
            isRead: false,
          });
        }
      } else if (
        frindesRequest2 &&
        frindesRequest2.from.includes(parseInt(req.body.userFrindId))
      ) {
        frindesRequest2.date.splice(
          frindesRequest2.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest2.notificationSeen.splice(
          frindesRequest2.from.indexOf(parseInt(req.body.userId)),
          1
        );
        frindesRequest2.from.splice(
          frindesRequest2.from.indexOf(parseInt(req.body.userId)),
          1
        );
        if (frindesRequest2.from.length == 0) {
          await db.frindesRequest.destroy({
            where: {
              to: req.body.userId,
            },
          });
        }
        if (frindesRequest2.to == req.body.userId) {
          await db.userNotification.create({
            userId: req.body.userId,
            to: req.body.userFrindId,
            type: "R.Cancel__R.Cancel",
            isSeen: false,
            isRead: false,
          });
        }
      } else if (frindesRequest) {
        frindesRequest.from.push(req.body.userId);
        frindesRequest.date.push(Date.now());
        frindesRequest.notificationSeen.push(false);
      } else {
        await db.frindesRequest.create({
          to: req.body.userFrindId,
          from: [req.body.userId],
          date: [Date.now()],
          notificationSeen: [false],
        });
        res.send("Add Request Success");
        return;
      }
      if (frindesRequest) {
        await db.frindesRequest.update(
          {
            from: frindesRequest.from,
            date: frindesRequest.date,
          },
          {
            where: {
              to: req.body.userFrindId,
            },
          }
        );
      } else {
        await db.frindesRequest.update(
          {
            from: frindesRequest2.from,
            date: frindesRequest2.date,
          },
          {
            where: {
              to: req.body.userId,
            },
          }
        );
      }
    }
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ addFrind ------------------*/

/*------------------ get All request for user ------------------*/
const getAllRequest = async function (req, res, next) {
  try {
    var allRequest = await db.frindesRequest.findOne({
      where: {
        to: req.body.userId,
      },
      attributes: ["from", "date", "notificationSeen"],
    });

    if (allRequest) {
      allRequest.notificationSeen.forEach((ele, i) => {
        allRequest.notificationSeen[i] = true;
      });
      await db.frindesRequest.update(
        {
          notificationSeen: allRequest.notificationSeen,
        },
        {
          where: {
            to: req.body.userId,
          },
        }
      );
      var userData = await db.users.findAll({
        where: {
          id: {
            [Op.in]: allRequest.from,
          },
        },
        attributes: ["fName", "lName", "image", "id"],
      });
      res.send([userData, allRequest]);
      return;
    }
    res.send([[], []]);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ get All request for user ------------------*/
/*------------------ start sendMessage ------------------*/
const getUserNotification = async (req, res, next) => {
  try {
    var userNotification = await db.userNotification.findAll({
      include: [
        {
          model: db.users,
          as: "notificationUser",
          where: { active: true },
          attributes: ["image", "fName", "lName", "id"],
        },
      ],
      limit: 8,
      offset: parseInt(req.body.offset),
      where: {
        to: req.body.userId,
      },
      order: [["createdAt", "desc"]],
    });
    await db.userNotification.update(
      {
        isSeen: true,
      },
      {
        where: {
          to: req.body.userId,
        },
      }
    );

    res.send(userNotification);
  } catch (error) {
    tryError(res);
  }
};
/*------------------ end sendMessage ------------------*/

/*------------------ cancel frendRequest ------------------*/
const CancelRequest = async (req, res, next, type = "cancel") => {
  try {
    var userFrindRequest = await db.frindesRequest.findOne({
      where: {
        to: req.body.userId,
      },
    });

    if (type == "cancel") {
      await db.userNotification.create({
        userId: req.body.userId,
        to: req.body.userFrindId,
        type: "R.Cancel__R.Cancel",
        isSeen: false,
        isRead: false,
      });
    } else {
      await db.userNotification.create({
        userId: req.body.userId,
        to: req.body.userFrindId,
        type: "R.Accept__R.Accept",
        isSeen: false,
        isRead: false,
      });
    }

    userFrindRequest.date.splice(
      userFrindRequest.from.indexOf(parseInt(req.body.userFrindId)),
      1
    );
    userFrindRequest.from.splice(
      userFrindRequest.from.indexOf(parseInt(req.body.userFrindId)),
      1
    );

    if (userFrindRequest.from.length == 0) {
      await db.frindesRequest.destroy({
        where: {
          to: req.body.userId,
        },
      });
    } else {
      await db.frindesRequest.update(
        {
          from: userFrindRequest.from,
          date: userFrindRequest.date,
        },
        {
          where: {
            to: req.body.userId,
          },
        }
      );
    }
    if (type == "cancel") {
      res.send("cancell success");
    }
  } catch (error) {
    tryError(res);
  }
};
/*------------------ cancel frendRequest ------------------*/

/*------------------ accept frendRequest ------------------*/
const acceptFrindRequest = async (req, res, next) => {
  try {
    CancelRequest(req, res, next, "accept");
    console.log("ahmed");
    var userFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    var frindFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.body.userFrindId,
      },
    });
    acceptFrind2(frindFrindes, req.body.userFrindId, req.body.userId, true);
    acceptFrind2(userFrindes, req.body.userId, req.body.userFrindId, false);
    res.send("accept success");
  } catch (error) {
    tryError(res);
  }
};
/*------------------ accept frendRequest ------------------*/
async function acceptFrind2(frindes, userId, userFrindId, direction) {
  if (frindes) {
    frindes.frindesId.push(userFrindId);
    frindes.RespondDirection.push(direction);
    frindes.frindRequestTime.push(Date.now());
    frindes.active.push(false);
    await db.userFrindes.update(
      {
        frindesId: frindes.frindesId,
        RespondDirection: frindes.RespondDirection,
        frindRequestTime: frindes.frindRequestTime,
        active: frindes.active,
      },
      {
        where: {
          userId: userId,
        },
      }
    );
  } else {
    await db.userFrindes.create({
      userId: userId,
      frindesId: [userFrindId],
      RespondDirection: [direction],
      frindRequestTime: [Date.now()],
      active: [true],
    });
  }
}

/*------------------ changeCoverImage ------------------*/
const changeCoverImage = async (req, res, next) => {
  try {
    var images = Rename_uploade_img(req);

    var userData = await db.moreDataForUser.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (userData) {
      if (userData.coverImage)
        removeImg(req, "users_photo/cover_image/", userData.coverImage);
      await db.moreDataForUser.update(
        {
          coverImage: images,
        },
        {
          where: {
            userId: req.body.userId,
          },
        }
      );
    } else {
      await db.moreDataForUser.create({
        coverImage: images,
        userId: req.body.userId,
      });
    }
    res.send("chang success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ changeCoverImage ------------------*/

/*-------------------------------------------- end part of posts ----------------------------------------*/

/*------------------ start get max descount ------------------*/
async function getMaxDescount(catigorys) {
  var MainDescoutnArr = [];
  for (var i = 0; i < catigorys.length; i++) {
    var product = await db.products.findAll({
      where: {
        catigory: catigorys[i].id,
      },
      order: [["descount", "desc"]],
      limit: 1,
    });
    if (product.length) {
      MainDescoutnArr.push(product[0].descount);
    } else {
      MainDescoutnArr.push(null);
    }
  }
  return MainDescoutnArr;
}
/*------------------ end get max descount ------------------*/

/*------------------ start get max descount ------------------*/
const getEmoji = async (req, res, next) => {
  var emoji = require("../../jsonFileForEmoji V2");
  var arrEmoji = [];
  emoji.forEach((ele) => {
    if (!arrEmoji.includes(ele) && ele.category == req.body.catigory) {
      arrEmoji.push(ele);
    }
  });
  res.send(arrEmoji);
};
/*------------------ end get max descount ------------------*/

/*------------------ end activeUserMessage ------------------*/
const UserMessage = async (req, res, next) => {
  try {
    var userFrindActive = [];
    var userFrindes = await db.userFrindes.findOne({
      where: {
        userId: req.body.userId,
      },
      attributes: ["frindesId"],
    });

    if (userFrindes) {
      req.body.allUserFrindOnline.forEach((ele) => {
        if (userFrindes.frindesId.includes(parseInt(ele.id))) {
          userFrindActive.push(ele.id);
        }
      });
    }
    var ActiveUsers = await db.users.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: userFrindActive,
            },
          },
        ],
      },
      attributes: ["id", "image", "lName", "fName"],
    });

    var UserChate = await db.usersChat.findAll({
      where: {
        from: req.body.userId,
      },
      include: [
        {
          model: db.users,
          as: "chatUser",
          attributes: ["id", "image", "fName", "lName"],
          where: { active: true },
          include: [
            {
              model: db.usersMessage,
              as: "userFromMessage",
              where: { to: req.body.userId },
              attributes: ["message", "createdAt", "from", "isSeen"],
              order: [["createdAt", "desc"]],
              limit: 1,
            },
            {
              model: db.usersMessage,
              as: "userToMessage",
              where: { from: req.body.userId },
              attributes: ["message", "createdAt", "from", "isSeen"],
              order: [["createdAt", "desc"]],
              limit: 1,
            },
          ],
        },
      ],
      order: [["createdAt", "desc"]],
    });
    res.send([ActiveUsers, UserChate]);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end activeUserMessage ------------------*/

/*------------------ start getFrindMessages ------------------*/
const getFrindMessages = async (req, res, next) => {
  try {
    var user = await db.users.findOne({
      where: {
        id: req.body.frindId,
      },
      attributes: ["lName", "fName", "id", "image"],
    });
    var messages = await db.usersMessage.findAll({
      where: {
        [Op.or]: [
          {
            from: req.body.frindId,
            to: req.body.userId,
          },
          {
            from: req.body.userId,
            to: req.body.frindId,
          },
        ],
      },
      order: [["createdAt", "asc"]],
    });

    await db.usersMessage.update(
      { isSeen: true },
      {
        where: {
          isSeen: false,
          from: req.body.frindId,
          to: req.body.userId,
        },
      }
    );
    res.send([user, messages]);
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ end getFrindMessages ------------------*/

/*------------------ start sendMessage ------------------*/
const sendMessage = async (req, res, next) => {
  try {
    if (req.body.isEmpty == "true") {
      await db.usersChat.bulkCreate([
        {
          from: req.body.userId,
          to: req.body.frindId,
        },
        {
          to: req.body.userId,
          from: req.body.frindId,
        },
      ]);
    }
    await db.usersMessage
      .create({
        from: req.body.userId,
        to: req.body.frindId,
        message: req.body.message,
      })
      .then(async (result) => {
        await db.usersChat.update(
          { createdAt: Date.now() },
          {
            where: {
              from: req.body.userId,
              to: req.body.frindId,
            },
          }
        );
        res.send([result.createdAt, result.message]);
      });
  } catch (error) {
    tryError(res);
  }
};
/*------------------ end sendMessage ------------------*/

/*------------------ removeIsSeenFromChate ------------------*/
const removeIsSeenFromChate = async (req, res, next) => {
  try {
    await db.usersChat.update(
      { isSaved: false },
      {
        where: {
          from: req.body.userId,
          to: req.body.frindId,
        },
      }
    );
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ removeIsSeenFromChate ------------------*/

/*------------------ addIsSeenFromChate ------------------*/
const addIsSeenFromChate = async (req, res, next) => {
  try {
    await db.usersChat.update(
      { isSaved: true },
      {
        where: {
          from: req.body.userId,
          to: req.body.frindId,
        },
      }
    );
    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ addIsSeenFromChate ------------------*/

/*------------------ addProductToShopingCart ------------------*/
const addProductToShopingCart = async (req, res, next) => {
  try {
    var product = await db.shopingCart.findOne({
      where: {
        productId: req.body.productId,
        userId: req.body.userId,
      },
    });
    if (product) {
      await db.shopingCart.update(
        {
          count: parseInt(req.body.count) + parseInt(product.count),
        },
        {
          where: {
            productId: req.body.productId,
            userId: req.body.userId,
          },
        }
      );
    } else {
      await db.shopingCart.create({
        productId: req.body.productId,
        userId: req.body.userId,
        count: req.body.count,
      });
    }

    res.send("success");
  } catch (error) {
    tryError(res, error);
  }
};
/*------------------ addProductToShopingCart ------------------*/

/*------------------ shopingCardChangQuantity ------------------*/
const shopingCardChangQuantity = async (req, res, next) => {
  try {
    await db.shopingCart.update(
      {
        count: req.body.count,
      },
      {
        where: {
          userId: req.body.userId,
          productId: req.body.productId,
        },
      }
    );
    res.send("success");
  } catch (error) {
    tryError(res);
  }
};
/*------------------ shopingCardChangQuantity ------------------*/

/*------------------ removeProductFromShipingCard ------------------*/
const removeProductFromShipingCard = async (req, res, next) => {
  try {
    await db.shopingCart.destroy({
      where: {
        userId: req.body.userId,
        productId: req.body.productId,
      },
    });
    res.send("success");
  } catch (error) {
    tryError(res);
  }
};
/*------------------ removeProductFromShipingCard ------------------*/

module.exports = {
  MainPageController,
  catigoryShow_controller,
  productDetails_controller,
  getProductAllComments,
  getAllProduct,
  getDataSearch_ajax,
  getMyAccount,
  editPersonalInformationGet,
  editPersonalInformationPost,
  editPostAjax,
  getSearchUserData,
  addPostAjax,
  AddLikesAjax,
  addCommentOnPosts,
  getMoreComments,
  AddLikesOnCommentsAjax,
  GetSomeOfPosts,
  getEmoji,
  membersPosts,
  deletePost_ajax,
  getPost_Data,
  deleteCommentAjax,
  editCommentAjax,
  getCommentData,
  addRequest,
  getAllRequest,
  CancelRequest,
  acceptFrindRequest,
  changeCoverImage,
  UserMessage,
  sendMessage,
  getFrindMessages,
  getUserNotification,
  removeIsSeenFromChate,
  addIsSeenFromChate,
  addProductToShopingCart,
  shopingCart_controller,
  shopingCardChangQuantity,
  removeProductFromShipingCard,
  payForWebsit,
};
