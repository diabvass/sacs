const Router = require("express").Router();
const auth = require("../../middlewares/index");
const controller = require("../../controllers/index.controller");

Router.get("/", auth(["admin"]), controller.balles.stockActuel);

module.exports = Router;