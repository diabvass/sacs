
const User = require("../../models/user.model");

module.exports = async (__req, res) => {
    try {
        // model User
        const users = await User.findAll();
        return res.status(200).json({
            message: "liste de tous les users.",
            data: users
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
};   