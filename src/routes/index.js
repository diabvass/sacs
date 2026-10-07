const connexion = require("../controllers/connexion.controller")
const logout = require("../controllers/logout.controller")
const Router = require("express").Router();
const users = require("./users/index");

Router.post("/login", connexion);
Router.get("/logout", logout);
Router.use("/users", users)

module.exports = Router;