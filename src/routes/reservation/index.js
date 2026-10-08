const Router = require("express").Router();
const controllers = require("../../controllers/index.controller");
const auth = require("../../middlewares/index");

Router.get("/:statut", auth(["admin", "gerant"]), controllers.reservation.liste)