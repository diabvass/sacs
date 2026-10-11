
const Balle = require("../../models/balles/stockActuel.model");

module.exports = async (req, res) => {
    try {
        const id_balle = Number(req.params.id_balle);
        if(!id_balle) return res.status(400).json({
            message: "Non trouvé"
        })
        // model balles
        const balle = await Balle.stockActuelOne(id_balle);
        return res.status(200).json({
            message: "le stock actuel de balles.",
            data: balle
        })

    } catch (error) {
        console.error(error.message);
        if(error.message === "Aucune information.") return res.status(400).json({
            message: "Aucune information."
        })
        res.status(500).json({ message: "Erreur serveur" });
    }
};   