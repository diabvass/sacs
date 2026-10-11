
const User = require("../../models/user.model");

module.exports = async (req, res) => {
    try {
        const idPk = req.params.id;

        if (!idPk || typeof (idPk) !== "string") return res.status(400).json({
            message: "Erreur données fournies"
        })

        // user connecté
        const role = req.user.role;
        const id_user = req.user.id_user;

        if (role === "gerant" && idPk !== id_user) {
            console.log("Accès interdit() : vous ne pouvez pas voir les informations cet utilisateur.")
            return res.status(403).json({
                message: "Accès interdit : vous ne pouvez pas voir les informations cet utilisateur."
            });
        }
        // model User
        const user = await User.findOne(idPk);
        return res.status(200).json({
            message: "informations user.",
            data: user
        })

    } catch (error) {
        console.error(error.message);
        if(error.message === 'Utilisateur non trouvé')
            return res.status(400).json({ message: error.message });
        res.status(500).json({ message: "Erreur serveur" });
    }
};   