
const Balle = require("../../models/balles/flux.model");

module.exports = async (req, res) => {
    try {
        const {
            nombre_balle,
            id_balle
        } = req.body;
        let type_flux = req.body.type_flux.toLocaleLowerCase();
        const id_user = req.user.id_user; // user connecté

        const type = (!type_flux || !nombre_balle || !id_balle ||
            typeof type_flux !== "string" || typeof id_balle !== "number" ||
            typeof nombre_balle !== "number");

        if (type) return res.status(400).json({
            message: "Format de données incorrectes"
        });

        const valide = ["entree", "sortie"];
        if (!valide.includes(type_flux))
            return res.status(400).json({
                message: "Requête non prise en charge.",
            })

        const stock = await Balle.stock(id_balle);

        if (type_flux === "sortie") {
            if (nombre_balle > stock[0].stock)
                return res.status(400).json({
                    message: "Stock insuffisant.",
                })
        }

        await Balle.ES(type_flux, nombre_balle, id_balle, id_user);
        const mes = type_flux === "entree" ? "Depôt" : "Retrait";
        return res.status(201).json({
            message: `${mes} de ${nombre_balle} balle(s) - le stock a été mis à jour.`,
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
};   