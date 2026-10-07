
const Balle = require("../../models/balle.model");

module.exports = async (__req, res) => {
    try {
        // model balles
        const balle = await Balle.stockActuel();
        return res.status(200).json({
            message: "le stock actuel de balles.",
            data: balle
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
};   