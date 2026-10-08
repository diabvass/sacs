const Reservation = require("../../models/reservation.model");
module.exports = {
  liste : async(req,res) => {
    try {
      const statut = req.params.statut;
      
      if(!statut || typeof(statut) !== "string")
        return res.status(400).json({
          message: "Erreur données fournies"
        })

      const autorise = ["paye", "attente"];
      if(!autorise.includes(statut.toLocaleLowerCase()))
        return res.status(400).json({
          message: "Statut invalide"
        })
      
      const liste = await Reservation.liste(statut);
      return res.status(200).json({
        message: "liste de toutes les reservations.",
        data: liste
        })
    }
    catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}