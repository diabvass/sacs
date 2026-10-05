const Router = require("express").Router();
const inscription = require("../../controllers/inscription.controller")
const auth = require("../../middlewares/index");

Router.post("/created", auth(["admin"]), inscription);

module.exports = Router;