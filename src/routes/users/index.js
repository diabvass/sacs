const Router = require("express").Router();
const controllers = require("../../controllers/index.controller");

const auth = require("../../middlewares/index");

Router.post("/created", auth(["admin"]), controllers.users.inscription);
Router.get("/all", auth(["admin"]), controllers.users.selectAll);
Router.get("/:id", auth(["admin", "gerant"]), controllers.users.selectOne);


module.exports = Router;