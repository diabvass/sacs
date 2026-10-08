const connexion = require("../controllers/connexion.controller")
const logout = require("../controllers/logout.controller")
const Router = require("express").Router();
const users = require("./users/index");
const reservation = require("./reservation/index");

Router.post("/login", connexion);
Router.get("/logout", logout);
Router.use("/users", users)
Router.use("/reservation", reservation)

module.exports = Router;