const Router = require("express").Router();

Router.get("/", (__req, res) => {
    return res.status(200).json({
        message: "Route succès"
    })
})

module.exports = Router;